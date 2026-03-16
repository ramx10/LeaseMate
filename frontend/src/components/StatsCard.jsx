export default function StatsCard({ title, value, icon, gradient }) {
  const gradientStyle = gradient || "linear-gradient(135deg, #6366f1, #3b82f6)";
  return (
    <div
      className="relative bg-white rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}
    >
      {/* Top accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: gradientStyle }} />

      <div className="flex items-start justify-between mt-2">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">{value ?? "—"}</h2>
        </div>
        {icon && (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl text-white flex-shrink-0"
            style={{ background: gradientStyle }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}