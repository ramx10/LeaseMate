import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

export default function Rooms() {

  const [rooms, setRooms] = useState([]);
  const [properties, setProperties] = useState([]);

  const [propertyId, setPropertyId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [rent, setRent] = useState("");

  /* Fetch Rooms */
  const fetchRooms = () => {
    axios.get("http://localhost:5000/api/rooms")
      .then(res => setRooms(res.data))
      .catch(err => console.log(err));
  };

  /* Fetch Properties */
  const fetchProperties = () => {
    axios.get("http://localhost:5000/api/properties")
      .then(res => setProperties(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchRooms();
    fetchProperties();
  }, []);

  /* Add Room */
  const addRoom = async () => {

    if (!propertyId || !roomNumber || !rent) return;

    await axios.post("http://localhost:5000/api/rooms/add", {
      property_id: propertyId,
      room_number: roomNumber,
      rent: rent
    });

    setRoomNumber("");
    setRent("");

    fetchRooms();
  };

  /* Delete Room */
  const deleteRoom = async (id) => {

    await axios.delete(`http://localhost:5000/api/rooms/${id}`);

    fetchRooms();
  };

  return (
    <MainLayout>

      <h1 className="text-2xl font-bold mb-6">Rooms</h1>

      {/* Add Room */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">

        <select
          className="border p-2 rounded"
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
          className="border p-2 rounded"
          placeholder="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Rent"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
        />

        <button
          onClick={addRoom}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>

      </div>

      {/* Rooms Table */}

      <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Rent</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {rooms.map((room) => {

              const property = properties.find(
                (p) => p.id === room.property_id
              );

              return (
                <tr key={room.id} className="border-t">

                  <td className="p-3">{room.id}</td>

                  <td className="p-3">
                    {property ? property.property_name : "Unknown"}
                  </td>

                  <td className="p-3">{room.room_number}</td>

                  <td className="p-3">{room.max_tenants}</td>

                  <td className="p-3">₹ {room.total_rent}</td>

                  <td className="p-3">

                    <button
                      onClick={() => deleteRoom(room.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </MainLayout>
  );
}