import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layout/MainLayout";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
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
  ];

  return (
    <MainLayout title="Settings">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Account Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your profile and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 w-fit">
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

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl p-6 animate-fade-in" style={{ boxShadow: "var(--shadow-md)" }}>
            <h2 className="text-base font-bold text-slate-700 mb-5">Profile Information</h2>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white uppercase"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 6px 16px rgba(99,102,241,0.3)",
                }}
              >
                {user?.name?.[0] || "O"}
              </div>
              <div>
                <p className="text-base font-semibold text-slate-800">{user?.name || "Owner"}</p>
                <p className="text-sm text-slate-400">{user?.email || "owner@example.com"}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {user?.role || "Owner"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Role</label>
                <input
                  type="text"
                  value={user?.role || "Owner"}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
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
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
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

        {/* Security Tab */}
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
      </div>
    </MainLayout>
  );
}
