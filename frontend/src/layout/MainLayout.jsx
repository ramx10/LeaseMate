import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function MainLayout({ children, title }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--surface-bg)" }}>
      <Sidebar onCollapse={setSidebarCollapsed} />

      {/* Main content area - offset by sidebar width */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: "var(--sidebar-width)" }}
      >
        <Navbar title={title} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}