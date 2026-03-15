import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

export default function Tenants() {

  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deposit, setDeposit] = useState("");

  const fetchTenants = () => {
    axios.get("http://localhost:5000/api/tenants")
      .then(res => setTenants(res.data))
      .catch(err => console.log(err));
  };

  const fetchRooms = () => {
    axios.get("http://localhost:5000/api/rooms")
      .then(res => setRooms(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchTenants();
    fetchRooms();
  }, []);

  const addTenant = async () => {

    if (!roomId || !name || !phone || !deposit) return;

    await axios.post("http://localhost:5000/api/tenants/add", {
      room_id: roomId,
      name,
      phone,
      deposit
    });

    setName("");
    setPhone("");
    setDeposit("");

    fetchTenants();
  };

  const deleteTenant = async (id) => {

    await axios.delete(`http://localhost:5000/api/tenants/${id}`);

    fetchTenants();
  };

  return (
    <MainLayout>

      <h1 className="text-2xl font-bold mb-6">Tenants</h1>

      {/* Add Tenant */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">

        <select
          className="border p-2 rounded"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        >

          <option value="">Select Room</option>

          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              Room {room.room_number}
            </option>
          ))}

        </select>

        <input
          className="border p-2 rounded"
          placeholder="Tenant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Deposit"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
        />

        <button
          onClick={addTenant}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Tenant
        </button>

      </div>

      {/* Tenant Table */}

      <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Deposit</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {tenants.map((tenant) => (

              <tr key={tenant.id} className="border-t">

                <td className="p-3">{tenant.id}</td>
                <td className="p-3">{tenant.name}</td>
                <td className="p-3">{tenant.phone}</td>
                <td className="p-3">₹ {tenant.deposit}</td>

                <td className="p-3">

                  <button
                    onClick={() => deleteTenant(tenant.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </MainLayout>
  );
}