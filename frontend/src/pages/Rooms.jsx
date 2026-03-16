import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [properties, setProperties] = useState([]);

  const [propertyId, setPropertyId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  // BUG FIX: was "rent" before — API expects "total_rent" and "max_tenants"
  const [totalRent, setTotalRent] = useState("");
  const [maxTenants, setMaxTenants] = useState("");

  const fetchRooms = () => {
    axios
      .get("http://localhost:5000/api/rooms")
      .then((res) => setRooms(res.data))
      .catch((err) => console.log(err));
  };

  const fetchProperties = () => {
    axios
      .get("http://localhost:5000/api/properties")
      .then((res) => setProperties(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchRooms();
    fetchProperties();
  }, []);

  const addRoom = async () => {
    if (!propertyId || !roomNumber || !totalRent || !maxTenants) return;
    // BUG FIX: send correct field names matching the backend controller
    await axios.post("http://localhost:5000/api/rooms/add", {
      property_id: propertyId,
      room_number: roomNumber,
      total_rent: totalRent,
      max_tenants: maxTenants,
    });
    setRoomNumber("");
    setTotalRent("");
    setMaxTenants("");
    fetchRooms();
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room? All tenants in this room will also be removed.")) return;
    await axios.delete(`http://localhost:5000/api/rooms/${id}`);
    fetchRooms();
  };

  return (
    <MainLayout title="Rooms">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🚪 Rooms</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage rooms across your properties</p>
        </div>
        <div className="text-sm font-medium text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-full">
          {rooms.length} room{rooms.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Add Room Card */}
      <div className="bg-white rounded-2xl p-5 mb-6" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
        <h2 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">Add New Room</h2>
        <div className="flex flex-wrap gap-3">
          <select
            className="flex-1 min-w-40 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          >
            <option value="">Select Property</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.property_name}
              </option>
            ))}
          </select>
          <input
            className="flex-1 min-w-32 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
          <input
            className="flex-1 min-w-32 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Total Rent (₹)"
            type="number"
            value={totalRent}
            onChange={(e) => setTotalRent(e.target.value)}
          />
          <input
            className="flex-1 min-w-32 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Max Tenants"
            type="number"
            value={maxTenants}
            onChange={(e) => setMaxTenants(e.target.value)}
          />
          <button
            onClick={addRoom}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
          >
            + Add Room
          </button>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">#</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Property</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Room</th>
              {/* BUG FIX: was missing "Max Tenants" header — now matches 6 td columns */}
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Max Tenants</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Total Rent</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No rooms found</td>
              </tr>
            ) : (
              rooms.map((room, i) => {
                const property = properties.find((p) => p.id === room.property_id);
                return (
                  <tr
                    key={room.id}
                    className={`border-t border-gray-50 hover:bg-cyan-50/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="px-5 py-3.5 text-gray-400 text-sm">{room.id}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      {property ? property.property_name : room.property_name || "Unknown"}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-700 text-sm">{room.room_number}</td>
                    <td className="px-5 py-3.5 text-sm">
                      <span className="bg-indigo-50 text-indigo-600 font-medium px-2.5 py-1 rounded-full text-xs">
                        {room.max_tenants} tenants
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800 text-sm">₹ {room.total_rent}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => deleteRoom(room.id)}
                        className="text-xs px-3 py-1.5 rounded-lg text-red-600 font-medium bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}