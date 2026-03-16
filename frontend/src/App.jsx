import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Rooms from "./pages/Rooms";
import Tenants from "./pages/Tenants";
import Ledger from "./pages/Ledger";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}