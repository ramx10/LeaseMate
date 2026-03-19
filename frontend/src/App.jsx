import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TenantDashboard from "./pages/TenantDashboard";
import Properties from "./pages/Properties";
import Rooms from "./pages/Rooms";
import Tenants from "./pages/Tenants";
import Ledger from "./pages/Ledger";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["Owner"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Tenant"]}>
                <TenantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties"
            element={
              <ProtectedRoute allowedRoles={["Owner"]}>
                <Properties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute allowedRoles={["Owner"]}>
                <Rooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenants"
            element={
              <ProtectedRoute allowedRoles={["Owner"]}>
                <Tenants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ledger"
            element={
              <ProtectedRoute allowedRoles={["Owner"]}>
                <Ledger />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["Owner", "Tenant"]}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}