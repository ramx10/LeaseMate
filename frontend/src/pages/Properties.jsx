import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

export default function Properties() {

  const [properties, setProperties] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const fetchProperties = () => {
    axios.get("http://localhost:5000/api/properties")
      .then(res => setProperties(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async () => {
    try {
      await axios.post("http://localhost:5000/api/properties/add", {
        name,
        address
      });

      setName("");
      setAddress("");
      fetchProperties();

    } catch (err) {
      console.log(err);
    }
  };

  const deleteProperty = async (id) => {
    await axios.delete(`http://localhost:5000/api/properties/${id}`);
    fetchProperties();
  };

  return (
    <MainLayout>

      <h1 className="text-2xl font-bold mb-6">Properties</h1>

      <div className="flex gap-4 mb-6">

        <input
          className="border p-2 rounded"
          placeholder="Property Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addProperty}
        >
          Add Property
        </button>

      </div>

      <table className="w-full bg-white shadow rounded">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Address</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>

          {properties.map((p) => (
            <tr key={p.id} className="border-t">

              <td className="p-3">{p.id}</td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.address}</td>

              <td className="p-3">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteProperty(p.id)}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </MainLayout>
  );
}