export default function StatsCard({ title, value, icon, gradient, trend, trendLabel }) {
  const gradientStyle = gradient || "linear-gradient(135deg, #6366f1, #8b5cf6)";

  return (
    <div
      className="relative bg-white rounded-2xl p-6 overflow-hidden card-hover animate-fade-in-up"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      {/* Top accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: gradientStyle }}
      />

      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.07]"
        style={{ background: gradientStyle }}
      />

      <div className="flex items-start justify-between">
        <div className="relative z-10">
          <p className="text-slate-500 text-[13px] font-medium tracking-wide">{title}</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2 tracking-tight">{value ?? "—"}</h2>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                trend >= 0
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-rose-700 bg-rose-50"
              }`}>
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
              {trendLabel && (
                <span className="text-slate-400 text-[11px]">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white flex-shrink-0"
            style={{
              background: gradientStyle,
              boxShadow: `0 6px 16px ${gradientStyle.includes('#6366f1') ? 'rgba(99,102,241,0.3)' : gradientStyle.includes('#3b82f6') ? 'rgba(59,130,246,0.3)' : gradientStyle.includes('#10b981') ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}