import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children, title }) {
  return (
    <div className="flex min-h-screen" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f0f7ff 100%)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar title={title} />
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}