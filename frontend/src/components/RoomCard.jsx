import { useState } from "react";

const statusConfig = {
  paid: {
    label: "Paid",
    emoji: "✅",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    emoji: "❌",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  partial: {
    label: "Partial",
    emoji: "⚠️",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
};

export default function RoomCard({ room, onMarkPayment }) {
  const [hoveredTenant, setHoveredTenant] = useState(null);

  const tenants = room.tenants || [];
  const paidCount = tenants.filter((t) => t.status === "paid").length;
  const totalCount = tenants.length;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden animate-fade-in-up transition-all duration-300 hover:-translate-y-1 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] cursor-default group"
    >
      {/* Room Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 4px 10px rgba(99,102,241,0.25)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><line x1="2" y1="20" x2="22" y2="20"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Room {room.room_number || room.roomNumber}</h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {paidCount}/{totalCount} paid
            </p>
          </div>
        </div>

        {/* Status Chip */}
        <div className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
          paidCount === totalCount && totalCount > 0
            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
            : paidCount > 0
            ? "bg-amber-50 text-amber-600 border border-amber-200"
            : "bg-rose-50 text-rose-600 border border-rose-200"
        }`}>
          {paidCount === totalCount && totalCount > 0 ? "All Paid" : paidCount > 0 ? "Partial" : "Unpaid"}
        </div>
      </div>

      {/* Tenant List */}
      <div className="px-5 py-3">
        {tenants.length === 0 ? (
          <div className="py-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <p className="text-xs text-slate-400 font-medium">No tenants yet</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {tenants.map((tenant, idx) => {
              const status = statusConfig[tenant.status] || statusConfig.pending;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 px-3 rounded-xl transition-all duration-200 cursor-default group"
                  style={{
                    background: hoveredTenant === idx ? "rgba(241,245,249,0.8)" : "transparent",
                  }}
                  onMouseEnter={() => setHoveredTenant(idx)}
                  onMouseLeave={() => setHoveredTenant(null)}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase"
                      style={{
                        background: `hsl(${(idx * 60 + 220) % 360}, 60%, 55%)`,
                      }}
                    >
                      {tenant.name?.[0] || "?"}
                    </div>
                    <span className="text-[13px] font-medium text-slate-700">{tenant.name}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${status.bg} ${status.text} border ${status.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label} {status.emoji}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer with Mark Payment button */}
      {tenants.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100">
          <button
            onClick={() => onMarkPayment && onMarkPayment(room)}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}
          >
            Mark Payment
          </button>
        </div>
      )}
    </div>
  );
}
