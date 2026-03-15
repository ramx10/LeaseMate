import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

export default function Ledger() {

  const [ledger, setLedger] = useState([]);
  const [tenants, setTenants] = useState([]);

  const [tenantId, setTenantId] = useState("");
  const [month, setMonth] = useState("");
  const [rent, setRent] = useState("");
  const [units, setUnits] = useState("");
  const [rate, setRate] = useState("");

  const fetchLedger = () => {
    axios.get("http://localhost:5000/api/ledger")
      .then(res => setLedger(res.data));
  };

  const fetchTenants = () => {
    axios.get("http://localhost:5000/api/tenants")
      .then(res => setTenants(res.data));
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
      electricity: units
    });

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
    <MainLayout>

      <h1 className="text-2xl font-bold mb-6">Ledger</h1>

      {/* Add Entry */}

      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-center">

  <select
    className="border p-2 rounded w-48"
    value={tenantId}
    onChange={(e) => setTenantId(e.target.value)}
  >
    <option value="">Select Tenant</option>
    {tenants.map((t) => (
      <option key={t.id} value={t.id}>
        Room {t.room_number}
      </option>
    ))}
  </select>

  <input
    className="border p-2 rounded w-40"
    placeholder="Month"
    onChange={(e) => setMonth(e.target.value)}
  />

  <input
    className="border p-2 rounded w-40"
    placeholder="Electricity"
    onChange={(e) => setUnits(e.target.value)}
  />

  <button
    onClick={addLedger}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Add
  </button>

</div>

      {/* Ledger Table */}

      <table className="w-full bg-white shadow rounded">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-3">Property</th>
            <th className="p-3">Room</th>
            <th className="p-3">Month</th>
            <th className="p-3">Total</th>
            <th className="p-3">Paid</th>
            <th className="p-3">Action</th>
          </tr>

        </thead>

        <tbody>

          {ledger.map((l) => (

            <tr key={l.id} className="border-t">

              <td className="p-3">{l.property_name}</td>
              <td className="p-3">{l.room_number}</td>
              <td className="p-3">{l.month}</td>
              <td className="p-3">₹ {l.total_amount}</td>

              <td className="p-3">
                {l.paid ? "✔ Paid" : "Pending"}
              </td>

              <td className="p-3">

                {!l.paid && (
                  <button
                    onClick={() => markPaid(l.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Mark Paid
                  </button>
                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </MainLayout>
  );
}