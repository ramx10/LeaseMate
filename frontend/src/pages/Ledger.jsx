import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

export default function Ledger() {
  const [ledger, setLedger] = useState([]);
  const [tenants, setTenants] = useState([]);

  const [tenantId, setTenantId] = useState("");
  const [month, setMonth] = useState("");
  const [units, setUnits] = useState("");

  const fetchLedger = () => {
    axios
      .get("http://localhost:5000/api/ledger")
      .then((res) => setLedger(res.data))
      .catch((err) => console.log(err));
  };

  const fetchTenants = () => {
    axios
      .get("http://localhost:5000/api/tenants")
      .then((res) => setTenants(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchLedger();
    fetchTenants();
  }, []);

  const addLedger = async () => {
    try {
      if (!tenantId || !month || !units) return;
      await axios.post("http://localhost:5000/api/ledger/add", {
        tenant_id: tenantId,
        month: month,
        electricity: units,
      });
      setMonth("");
      setUnits("");
      fetchLedger();
    } catch (error) {
      console.log(error);
    }
  };

  const markPaid = async (id) => {
    await axios.put(`http://localhost:5000/api/ledger/paid/${id}`);
    fetchLedger();
  };

  return (
    <MainLayout title="Ledger">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📒 Ledger</h1>
          <p className="text-gray-500 text-sm mt-0.5">Monthly rent and electricity records</p>
        </div>
        <div className="flex gap-3">
          <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            ✔ Paid: {ledger.filter((l) => l.paid).length}
          </span>
          <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
            ⏳ Pending: {ledger.filter((l) => !l.paid).length}
          </span>
        </div>
      </div>

      {/* Add Entry Card */}
      <div className="bg-white rounded-2xl p-5 mb-6" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
        <h2 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">Add Ledger Entry</h2>
        <div className="flex flex-wrap gap-3">
          <select
            className="flex-1 min-w-44 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
          >
            <option value="">Select Tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                Room {t.room_number} — {t.phone}
              </option>
            ))}
          </select>
          <input
            className="flex-1 min-w-36 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Month (e.g. March 2025)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <input
            className="flex-1 min-w-36 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Electricity Cost (₹)"
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
          <button
            onClick={addLedger}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}
          >
            + Add Entry
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Property</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Room</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Month</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Rent</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Electricity</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Total</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Status</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {ledger.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">No ledger entries found</td>
              </tr>
            ) : (
              ledger.map((l, i) => (
                <tr
                  key={l.id}
                  className={`border-t border-gray-50 hover:bg-emerald-50/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  <td className="px-5 py-3.5 text-gray-600 text-sm">{l.property_name}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700 text-sm">{l.room_number}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm">{l.month}</td>
                  <td className="px-5 py-3.5 text-gray-700 text-sm">₹ {l.rent}</td>
                  <td className="px-5 py-3.5 text-gray-700 text-sm">₹ {l.electricity}</td>
                  {/* BUG FIX: was l.total_amount — the backend returns l.total */}
                  <td className="px-5 py-3.5 font-bold text-gray-800 text-sm">₹ {l.total}</td>
                  <td className="px-5 py-3.5">
                    {l.paid ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        ✔ Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        ⏳ Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {!l.paid && (
                      <button
                        onClick={() => markPaid(l.id)}
                        className="text-xs px-3 py-1.5 rounded-lg text-green-700 font-medium bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        ✔ Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}