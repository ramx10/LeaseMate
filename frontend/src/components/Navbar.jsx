import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ title = "Dashboard" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="px-6 py-4 flex items-center justify-between"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(99,102,241,0.15)",
        boxShadow: "0 1px 20px rgba(99,102,241,0.08)",
      }}
    >
      <div>
        <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
        <p className="text-gray-400 text-xs mt-0.5">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-gray-700 text-sm font-semibold">{user?.name || "User"}</p>
          <p className="text-gray-400 text-xs">{user?.role === "Tenant" ? "Tenant" : "Administrator"}</p>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-transform hover:scale-105 uppercase"
          style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
        >
          {user?.name?.[0] || (user?.role === "Tenant" ? "T" : "O")}
        </div>
        
        <button
          onClick={handleLogout}
          className="ml-2 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}