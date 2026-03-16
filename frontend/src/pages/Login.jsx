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
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
            🏢
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
