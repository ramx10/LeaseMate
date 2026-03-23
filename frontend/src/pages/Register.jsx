import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Owner");
  const [areaSearch, setAreaSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [buildingSearch, setBuildingSearch] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [areas, setAreas] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch areas as user types (debounced)
  useEffect(() => {
    if (role !== "Tenant") return;
    const timer = setTimeout(() => {
      const url = areaSearch
        ? `http://localhost:5000/api/auth/areas?q=${encodeURIComponent(areaSearch)}`
        : "http://localhost:5000/api/auth/areas";
      axios.get(url)
        .then((res) => setAreas(res.data))
        .catch((err) => console.log(err));
    }, 300);
    return () => clearTimeout(timer);
  }, [areaSearch, role]);

  // Fetch properties when area is selected, with building search
  useEffect(() => {
    if (!selectedArea) {
      setProperties([]);
      return;
    }
    const timer = setTimeout(() => {
      let url = `http://localhost:5000/api/auth/properties?area=${encodeURIComponent(selectedArea)}`;
      if (buildingSearch) {
        url += `&q=${encodeURIComponent(buildingSearch)}`;
      }
      axios.get(url)
        .then((res) => setProperties(res.data))
        .catch((err) => console.log(err));
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedArea, buildingSearch]);

  const selectArea = (area) => {
    setSelectedArea(area);
    setAreaSearch(area);
    setShowAreaDropdown(false);
    setPropertyId("");
    setBuildingSearch("");
  };

  const selectBuilding = (property) => {
    setPropertyId(property.id);
    setBuildingSearch(property.property_name);
    setShowBuildingDropdown(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !role) {
      setError("Please fill in all fields.");
      return;
    }
    if (role === "Tenant" && !selectedArea) {
      setError("Please select your area.");
      return;
    }
    if (role === "Tenant" && !propertyId) {
      setError("Please select a building/property.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
        property_id: role === "Tenant" ? propertyId : null,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" };
  const dropdownStyle = {
    background: "rgba(30,27,75,0.98)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e3a5f 100%)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
      <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />

      <div
        className="w-full max-w-md rounded-3xl p-8 relative"
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", boxShadow: "0 8px 24px rgba(99,102,241,0.4)" }}>
            <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="28" width="36" height="30" rx="4" stroke="white" strokeWidth="4.5" fill="none"/>
              <path d="M4 30L26 8L48 30" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M38 14L48 24" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <polyline points="16,44 24,52 38,34" stroke="rgba(255,255,255,0.8)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold">Create Account</h1>
          <p className="text-indigo-300 text-sm mt-1">Get started with LeaseMate today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-indigo-200 text-sm font-medium mb-1.5">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={inputStyle}
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-indigo-200 text-sm font-medium mb-1.5">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={inputStyle}
              placeholder="Enter gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-indigo-200 text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={inputStyle}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-indigo-200 text-sm font-medium mb-1.5">Role</label>
            <select
              className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={inputStyle}
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (e.target.value === "Owner") {
                  setSelectedArea("");
                  setAreaSearch("");
                  setPropertyId("");
                  setBuildingSearch("");
                }
              }}
            >
              <option value="Owner" style={{ background: "#1e1b4b" }}>🏠 Owner</option>
              <option value="Tenant" style={{ background: "#1e1b4b" }}>👤 Tenant</option>
            </select>
          </div>

          {/* Searchable Area + Building — shown only for Tenants */}
          {role === "Tenant" && (
            <>
              {/* Area search */}
              <div className="relative">
                <label className="block text-indigo-200 text-sm font-medium mb-1.5">🔍 Search Your Area</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  style={inputStyle}
                  placeholder="Type to search area (e.g. Kothrud)..."
                  value={areaSearch}
                  onChange={(e) => {
                    setAreaSearch(e.target.value);
                    setSelectedArea("");
                    setPropertyId("");
                    setBuildingSearch("");
                    setShowAreaDropdown(true);
                  }}
                  onFocus={() => setShowAreaDropdown(true)}
                  onBlur={() => setTimeout(() => setShowAreaDropdown(false), 200)}
                />
                {showAreaDropdown && areas.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden max-h-48 overflow-y-auto" style={dropdownStyle}>
                    {areas.map((a) => (
                      <button
                        key={a}
                        type="button"
                        className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-indigo-500/30 transition-colors capitalize"
                        onMouseDown={() => selectArea(a)}
                      >
                        📍 {a}
                      </button>
                    ))}
                  </div>
                )}
                {showAreaDropdown && areas.length === 0 && areaSearch && (
                  <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden" style={dropdownStyle}>
                    <p className="px-4 py-3 text-yellow-300 text-xs">No areas found matching "{areaSearch}"</p>
                  </div>
                )}
                {selectedArea && (
                  <p className="text-green-300 text-xs mt-1">✓ Area selected: <span className="capitalize font-medium">{selectedArea}</span></p>
                )}
              </div>

              {/* Building search — shown after area is selected */}
              {selectedArea && (
                <div className="relative">
                  <label className="block text-indigo-200 text-sm font-medium mb-1.5">🔍 Search Building / Property</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    style={inputStyle}
                    placeholder="Type to search building..."
                    value={buildingSearch}
                    onChange={(e) => {
                      setBuildingSearch(e.target.value);
                      setPropertyId("");
                      setShowBuildingDropdown(true);
                    }}
                    onFocus={() => setShowBuildingDropdown(true)}
                    onBlur={() => setTimeout(() => setShowBuildingDropdown(false), 200)}
                  />
                  {showBuildingDropdown && properties.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden max-h-48 overflow-y-auto" style={dropdownStyle}>
                      {properties.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-indigo-500/30 transition-colors"
                          onMouseDown={() => selectBuilding(p)}
                        >
                          🏢 {p.property_name}
                        </button>
                      ))}
                    </div>
                  )}
                  {showBuildingDropdown && properties.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden" style={dropdownStyle}>
                      <p className="px-4 py-3 text-yellow-300 text-xs">No buildings found in this area{buildingSearch ? ` matching "${buildingSearch}"` : ""}.</p>
                    </div>
                  )}
                  {propertyId && (
                    <p className="text-green-300 text-xs mt-1">✓ Building selected: <span className="font-medium">{buildingSearch}</span></p>
                  )}
                </div>
              )}
            </>
          )}

          {error && (
            <div className="text-red-300 text-sm bg-red-500/10 px-4 py-2.5 rounded-xl border border-red-500/20">
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white text-sm font-bold mt-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p className="text-center text-indigo-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-300 font-semibold hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
