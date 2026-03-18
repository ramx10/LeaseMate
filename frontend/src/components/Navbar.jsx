import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ title = "Dashboard" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className="sticky top-0 z-30 px-6 lg:px-8 py-4 flex items-center justify-between gap-4"
      style={{
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "1px solid rgba(226,232,240,0.8)",
      }}
    >
      {/* Left: Title */}
      <div className="flex-shrink-0">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
        <p className="text-slate-400 text-xs mt-0.5 font-medium">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div
          className={`flex items-center w-full gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
            searchFocused
              ? "bg-white ring-2 ring-indigo-500/20 shadow-lg"
              : "bg-slate-100/80 hover:bg-slate-100"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search properties, rooms, tenants..."
            className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-[13px]"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-200/60 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {/* Unread indicator */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" style={{ boxShadow: "0 0 6px rgba(244,63,94,0.5)" }} />
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div
              className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-slate-200/60 p-4 animate-fade-in"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}
            >
              <p className="text-sm font-semibold text-slate-700 mb-3">Notifications</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="w-2 h-2 mt-1.5 bg-indigo-500 rounded-full flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-600">3 pending rent payments for March</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="w-2 h-2 mt-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-600">New tenant registered to Room 102</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200" />

        {/* Profile section */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-slate-700 text-sm font-semibold leading-tight">{user?.name || "User"}</p>
            <p className="text-slate-400 text-[11px] font-medium">{user?.role === "Tenant" ? "Tenant" : "Administrator"}</p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-all hover:scale-105 hover:shadow-lg uppercase"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}
          >
            {user?.name?.[0] || (user?.role === "Tenant" ? "T" : "O")}
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="ml-1 px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all border border-rose-100 hover:border-rose-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}