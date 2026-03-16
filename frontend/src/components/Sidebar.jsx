import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ownerNavItems = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/properties", label: "Properties", icon: "🏠" },
  { to: "/rooms", label: "Rooms", icon: "🚪" },
  { to: "/tenants", label: "Tenants", icon: "👤" },
  { to: "/ledger", label: "Ledger", icon: "📒" },
];

const tenantNavItems = [
  { to: "/tenant-dashboard", label: "Dashboard", icon: "📊" },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = user?.role === "Tenant" ? tenantNavItems : ownerNavItems;

  return (
    <div className="w-64 min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #1e3a5f 100%)",
      }}
    >
      {/* Brand */}
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
            🏢
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">LeaseMate</h1>
            <p className="text-indigo-300 text-xs mt-0.5">Smart Tenant Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "text-white shadow-lg"
                  : "text-indigo-200 hover:text-white hover:bg-white/10"
              }`}
              style={
                isActive
                  ? { background: "linear-gradient(135deg, #6366f1, #3b82f6)", boxShadow: "0 4px 15px rgba(99,102,241,0.4)" }
                  : {}
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
            {user?.name?.[0] || (user?.role === "Tenant" ? "T" : "O")}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-indigo-400 text-xs">{user?.role === "Tenant" ? "Tenant" : "Admin Panel"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}