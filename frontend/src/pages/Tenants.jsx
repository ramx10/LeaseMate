import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [unassignedUsers, setUnassignedUsers] = useState([]);

  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [phone, setPhone] = useState("");
  const [deposit, setDeposit] = useState("");

  const fetchTenants = () => {
    axios
      .get("http://localhost:5000/api/tenants")
      .then((res) => setTenants(res.data))
      .catch((err) => console.log(err));
  };

  const fetchRooms = () => {
    axios
      .get("http://localhost:5000/api/rooms")
      .then((res) => setRooms(res.data))
      .catch((err) => console.log(err));
  };

  const fetchUnassignedUsers = () => {
    axios
      .get("http://localhost:5000/api/users/tenants/unassigned")
      .then((res) => setUnassignedUsers(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchTenants();
    fetchRooms();
    fetchUnassignedUsers();
  }, []);

  const addTenant = async () => {
    if (!userId || !roomId || !phone || !deposit) {
      alert("Please fill all fields");
      return;
    }
    
    try {
      await axios.post("http://localhost:5000/api/tenants/add", {
        user_id: userId,
        room_id: roomId,
        phone,
        deposit,
      });
      setUserId("");
      setRoomId("");
      setPhone("");
      setDeposit("");
      fetchTenants();
      fetchUnassignedUsers(); // refresh the dropdown
    } catch (err) {
      alert(err.response?.data || "Failed to add tenant");
      console.log(err);
    }
  };

  const deleteTenant = async (id) => {
    if (!window.confirm("Delete this tenant? Their ledger records will also be removed.")) return;
    await axios.delete(`http://localhost:5000/api/tenants/${id}`);
    fetchTenants();
    fetchUnassignedUsers();
  };

  return (
    <MainLayout title="Tenants">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">👤 Tenants</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage tenants across all rooms</p>
        </div>
        <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
          {tenants.length} tenant{tenants.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Add Tenant */}
      <div className="bg-white rounded-2xl p-5 mb-6" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
        <h2 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">Add New Tenant</h2>
        <div className="flex flex-wrap gap-3">
          <select
            className="flex-1 min-w-40 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {unassignedUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email}) — {user.property_name || ""}
              </option>
            ))}
          </select>
          <select
            className="flex-1 min-w-40 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                Room {room.room_number} — {room.property_name || ""}
              </option>
            ))}
          </select>
          <input
            className="flex-1 min-w-36 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="flex-1 min-w-36 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Security Deposit (₹)"
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
          />
          <button
            onClick={addTenant}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
          >
            + Add Tenant
          </button>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">#</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Name</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Property</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Room</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Phone</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Deposit</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No tenants found</td>
              </tr>
            ) : (
              tenants.map((t, i) => (
                <tr
                  key={t.id}
                  className={`border-t border-gray-50 hover:bg-indigo-50/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  <td className="px-5 py-3.5 text-gray-400 text-sm">{t.id}</td>
                  <td className="px-5 py-3.5 text-sm">
                    <div>
                      <p className="font-semibold text-gray-800">{t.tenant_name || "—"}</p>
                      <p className="text-xs text-gray-400">{t.tenant_email || ""}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm">{t.property_name}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700 text-sm">{t.room_number}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm">{t.phone}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800 text-sm">₹ {t.deposit}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => deleteTenant(t.id)}
                      className="text-xs px-3 py-1.5 rounded-lg text-red-600 font-medium bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      🗑 Delete
                    </button>
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