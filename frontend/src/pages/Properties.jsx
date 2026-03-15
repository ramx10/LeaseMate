import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

export default function Properties() {

  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");

  const fetchProperties = () => {
    axios.get("http://localhost:5000/api/properties")
      .then(res => {
        setProperties(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // SEARCH
  useEffect(() => {

  const result = properties.filter((p) =>
    (p.property_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  setFiltered(result);

}, [search, properties]);

  const addProperty = async () => {

    if (!name || !address) return;

   await axios.post("http://localhost:5000/api/properties/add", {
  property_name: name,
  address
});

    setName("");
    setAddress("");

    fetchProperties();
  };

  const deleteProperty = async (id) => {
    await axios.delete(`http://localhost:5000/api/properties/${id}`);
    fetchProperties();
  };

  return (
    <MainLayout>

      <h1 className="text-2xl font-bold mb-6">
        Properties
      </h1>

      {/* Add Property */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">

        <input
          className="border p-2 rounded w-1/3"
          placeholder="Property Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded w-1/3"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          onClick={addProperty}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Property
        </button>

      </div>

      {/* Search */}
      <div className="mb-4">

        <input
          className="border p-2 rounded w-1/3"
          placeholder="Search property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((p) => (

              <tr key={p.id} className="border-t hover:bg-gray-50">

                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.property_name}</td>
                <td className="p-3">{p.address}</td>

                <td className="p-3">

                  <button
                    onClick={() => deleteProperty(p.id)}
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