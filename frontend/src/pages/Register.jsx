import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Owner");
  const [propertyId, setPropertyId] = useState("");
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch properties for tenant registration
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/properties")
      .then((res) => setProperties(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !role) {
      setError("Please fill in all fields.");
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
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
            🏢
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
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
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
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
              placeholder="owner@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-indigo-200 text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-indigo-200 text-sm font-medium mb-1.5">Role</label>
            <select
              className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (e.target.value === "Owner") setPropertyId("");
              }}
            >
              <option value="Owner" style={{ background: "#1e1b4b" }}>🏠 Owner</option>
              <option value="Tenant" style={{ background: "#1e1b4b" }}>👤 Tenant</option>
            </select>
          </div>

          {/* Property/Building selection — shown only for Tenants */}
          {role === "Tenant" && (
            <div>
              <label className="block text-indigo-200 text-sm font-medium mb-1.5">Select Your Building / Property</label>
              <select
                className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
              >
                <option value="" style={{ background: "#1e1b4b" }}>— Choose a building —</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id} style={{ background: "#1e1b4b" }}>
                    🏢 {p.property_name}
                  </option>
                ))}
              </select>
              {properties.length === 0 && (
                <p className="text-yellow-300 text-xs mt-1.5">No buildings available yet. Ask your owner to add a property first.</p>
              )}
            </div>
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
