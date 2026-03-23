import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      login(res.data.user, res.data.token);
      
      // Redirect based on role
      if (res.data.user.role === "Tenant") {
        navigate("/tenant-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data || "Login failed. Please try again.");
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
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
      <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />

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
          <h1 className="text-white text-2xl font-bold">Welcome back</h1>
          <p className="text-indigo-300 text-sm mt-1">Sign in to your LeaseMate account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-indigo-200 text-sm font-medium mb-1.5">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
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
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

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
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="text-center text-indigo-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-300 font-semibold hover:text-white transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
