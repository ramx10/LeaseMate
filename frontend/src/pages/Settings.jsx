import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import axios from "axios";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const isTenant = user?.role === "Tenant";

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/me")
      .then((res) => {
        setProfile(res.data);
        setLoadingProfile(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingProfile(false);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // --- Tabs ---
  const ownerTabs = [
    { id: "profile", label: "Profile", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )},
    { id: "notifications", label: "Notifications", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    )},
    { id: "security", label: "Security", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    )},
    { id: "account", label: "Account", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    )},
  ];

  const tenantTabs = [
    { id: "profile", label: "Profile", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )},
    { id: "rental", label: "Rental Info", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { id: "security", label: "Security", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    )},
    { id: "account", label: "Account", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    )},
  ];

  const tabs = isTenant ? tenantTabs : ownerTabs;

  // Info row helper
  const InfoRow = ({ label, value, icon }) => (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))" }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-700 truncate">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <MainLayout title="Settings">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Account Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your profile and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 w-fit flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ======================== PROFILE TAB ======================== */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl p-6 animate-fade-in" style={{ boxShadow: "var(--shadow-md)" }}>
            <h2 className="text-base font-bold text-slate-700 mb-5">Profile Information</h2>

            {loadingProfile ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                {/* Avatar + basic info */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white uppercase"
                    style={{
                      background: isTenant
                        ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                        : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      boxShadow: isTenant
                        ? "0 6px 16px rgba(16,185,129,0.3)"
                        : "0 6px 16px rgba(99,102,241,0.3)",
                    }}
                  >
                    {profile?.name?.[0] || "U"}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-800">{profile?.name || "User"}</p>
                    <p className="text-sm text-slate-400">{profile?.email || "user@example.com"}</p>
                    <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border ${
                      isTenant
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    }`}>
                      {profile?.role || user?.role}
                    </span>
                  </div>
                </div>

                {/* Profile fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      defaultValue={profile?.name || ""}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
                    <input
                      type="email"
                      defaultValue={profile?.email || ""}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      defaultValue={profile?.phone || ""}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Role</label>
                    <input
                      type="text"
                      value={profile?.role || user?.role || ""}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-400 cursor-not-allowed"
                    />
                  </div>
                  {isTenant && (
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Member Since</label>
                      <input
                        type="text"
                        value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ======================== RENTAL INFO TAB (Tenant only) ======================== */}
        {activeTab === "rental" && isTenant && (
          <div className="bg-white rounded-2xl p-6 animate-fade-in" style={{ boxShadow: "var(--shadow-md)" }}>
            <h2 className="text-base font-bold text-slate-700 mb-5">Rental Information</h2>

            {loadingProfile ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Property" value={profile?.property_name} icon="🏢" />
                <InfoRow label="Address" value={profile?.address} icon="📍" />
                <InfoRow label="Area" value={profile?.area} icon="🗺️" />
                <InfoRow label="Room Number" value={profile?.room_number} icon="🚪" />
                <InfoRow label="Monthly Rent" value={profile?.total_rent ? `₹ ${profile.total_rent}` : null} icon="💰" />
                <InfoRow label="Security Deposit" value={profile?.deposit ? `₹ ${profile.deposit}` : null} icon="🛡️" />
                <InfoRow label="Join Date" value={profile?.join_date ? new Date(profile.join_date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : null} icon="📅" />
              </div>
            )}
          </div>
        )}

        {/* ======================== NOTIFICATIONS TAB (Owner only) ======================== */}
        {activeTab === "notifications" && !isTenant && (
          <div className="bg-white rounded-2xl p-6 animate-fade-in" style={{ boxShadow: "var(--shadow-md)" }}>
            <h2 className="text-base font-bold text-slate-700 mb-5">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { label: "Payment reminders", desc: "Get notified about upcoming and overdue rent payments" },
                { label: "New tenant alerts", desc: "Receive alerts when a new tenant registers" },
                { label: "Monthly reports", desc: "Get a monthly summary of your properties" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={idx < 2} className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================== SECURITY TAB ======================== */}
        {activeTab === "security" && (
          <div className="bg-white rounded-2xl p-6 animate-fade-in" style={{ boxShadow: "var(--shadow-md)" }}>
            <h2 className="text-base font-bold text-slate-700 mb-5">Security Settings</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                  }}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================== ACCOUNT TAB (Logout) ======================== */}
        {activeTab === "account" && (
          <div className="space-y-6 animate-fade-in">
            {/* Account info card */}
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "var(--shadow-md)" }}>
              <h2 className="text-base font-bold text-slate-700 mb-4">Account Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Account Type</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{isTenant ? "Tenant" : "Owner / Administrator"}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{profile?.email || user?.email || "—"}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Account Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 6px rgba(16,185,129,0.5)" }}></span>
                    <p className="text-sm font-semibold text-emerald-600">Active</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl p-6 border border-rose-100" style={{ boxShadow: "0 4px 20px rgba(244,63,94,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <h2 className="text-base font-bold text-rose-700">Danger Zone</h2>
              </div>
              <p className="text-sm text-slate-500 mb-5">Once you log out, you will need to sign in again with your credentials.</p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)",
                  boxShadow: "0 4px 12px rgba(225,29,72,0.3)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
