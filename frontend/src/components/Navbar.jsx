export default function Navbar({ title = "Dashboard" }) {
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

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-gray-700 text-sm font-semibold">Owner</p>
          <p className="text-gray-400 text-xs">Administrator</p>
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer"
          style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
        >
          O
        </div>
      </div>
    </div>
  );
}