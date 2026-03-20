import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const ownerNavItems = [
  { to: "/", label: "Dashboard", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )},
  { to: "/properties", label: "Properties", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { to: "/rooms", label: "Rooms", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  )},
  { to: "/tenants", label: "Tenants", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )},
  { to: "/ledger", label: "Payments", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  )},
  { to: "/issues", label: "Issues", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )},
];

const tenantNavItems = [
  { to: "/tenant-dashboard", label: "Dashboard", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )},
  { to: "/issues", label: "Issues", icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )},
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = user?.role === "Tenant" ? tenantNavItems : ownerNavItems;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          collapsed ? "opacity-0 pointer-events-none" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className="fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)",
          background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
        }}
      >
        {/* Brand Header */}
        <div className="px-5 py-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
                <rect x="8" y="28" width="36" height="30" rx="4" stroke="white" strokeWidth="4.5" fill="none"/>
                <path d="M4 30L26 8L48 30" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M38 14L48 24" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <polyline points="16,44 24,52 38,34" stroke="#818cf8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight leading-none">LeaseMate</h1>
              <p className="text-indigo-400 text-[11px] font-medium mt-0.5 tracking-wide uppercase">Management</p>
            </div>
          </div>
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? (
                <polyline points="9 18 15 12 9 6"/>
              ) : (
                <polyline points="15 18 9 12 15 6"/>
              )}
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-white/[0.06]" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Section label */}
          <p className={`text-indigo-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 transition-opacity duration-200 ${collapsed ? "opacity-0" : "opacity-100"}`}>
            Menu
          </p>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 animate-slide-in-left ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
                style={{
                  ...(isActive
                    ? {
                        background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 100%)",
                        boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.25)",
                      }
                    : {}),
                  animationDelay: `${index * 0.05}s`,
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
                title={collapsed ? item.label : ""}
              >
                <span className={`flex-shrink-0 transition-colors duration-200 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                  {item.icon}
                </span>
                <span className={`transition-all duration-300 whitespace-nowrap ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>
                  {item.label}
                </span>
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ boxShadow: "0 0 8px rgba(99,102,241,0.6)" }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings link */}
        <div className="px-3 pb-2">
          <div className="mx-1 border-t border-white/[0.06] mb-2" />
          <Link
            to="/settings"
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Settings" : ""}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-slate-500 group-hover:text-slate-300">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span className={`transition-all duration-300 whitespace-nowrap ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>
              Settings
            </span>
          </Link>
        </div>

        {/* User card */}
        <div className={`px-3 pb-5 ${collapsed ? "px-2" : ""}`}>
          <div
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${collapsed ? "justify-center px-0" : ""}`}
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              {user?.name?.[0] || (user?.role === "Tenant" ? "T" : "O")}
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
              <p className="text-white text-sm font-semibold truncate leading-tight">{user?.name || "User"}</p>
              <p className="text-indigo-400 text-[11px] font-medium">{user?.role === "Tenant" ? "Tenant" : "Owner"}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}