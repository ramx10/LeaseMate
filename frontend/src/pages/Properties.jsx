import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [search, setSearch] = useState("");

  const fetchProperties = () => {
    axios
      .get("http://localhost:5000/api/properties")
      .then((res) => {
        setProperties(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const result = properties.filter((p) =>
      (p.property_name || "").toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, properties]);

  const addProperty = async () => {
    if (!name || !address || !area) {
      alert("Please fill all fields including area");
      return;
    }
    await axios.post("http://localhost:5000/api/properties/add", {
      property_name: name,
      address,
      area,
    });
    setName("");
    setAddress("");
    setArea("");
    fetchProperties();
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    await axios.delete(`http://localhost:5000/api/properties/${id}`);
    fetchProperties();
  };

  return (
    <MainLayout title="Properties">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏠 Properties</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your buildings and properties</p>
        </div>
        <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
          {filtered.length} property{filtered.length !== 1 ? "ies" : ""}
        </div>
      </div>

      {/* Add Property Card */}
      <div className="bg-white rounded-2xl p-5 mb-6" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
        <h2 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">Add New Property</h2>
        <div className="flex flex-wrap gap-3">
          <input
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            placeholder="Property Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            className="flex-1 min-w-40 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            placeholder="Area (e.g. Kothrud)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <button
            onClick={addProperty}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
          >
            + Add Property
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          className="w-72 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          placeholder="🔍  Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">#</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Property Name</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Area</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Address</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No properties found</td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr key={p.id} className={`border-t border-gray-50 hover:bg-indigo-50/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <td className="px-5 py-3.5 text-gray-400 text-sm">{p.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700 text-sm">{p.property_name}</td>
                  <td className="px-5 py-3.5 text-sm">
                    <span className="inline-block bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-medium capitalize">
                      📍 {p.area || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-sm">{p.address}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => deleteProperty(p.id)}
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