import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import StatsCard from "../components/StatsCard";
import RentChart from "../components/RentChart";
import PaymentChart from "../components/PaymentChart";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <MainLayout title="Dashboard">

      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 mb-8 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 60%, #06b6d4 100%)" }}
      >
        <div className="absolute right-6 top-0 h-full opacity-10 flex items-center text-9xl select-none">🏢</div>
        <h1 className="text-2xl font-bold">Welcome back, Owner 👋</h1>
        <p className="text-indigo-100 mt-1 text-sm">Here's your property overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatsCard
          title="Total Tenants"
          value={stats.totalTenants}
          icon="👤"
          gradient="linear-gradient(135deg, #6366f1, #818cf8)"
        />
        <StatsCard
          title="Total Properties"
          value={stats.totalProperties}
          icon="🏠"
          gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
        />
        <StatsCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon="🚪"
          gradient="linear-gradient(135deg, #06b6d4, #22d3ee)"
        />
        <StatsCard
          title="Pending Rent"
          value={"₹ " + (stats.pending_rent || 0)}
          icon="💰"
          gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
          <h3 className="font-bold text-gray-700 mb-4 text-base">📈 Monthly Rent Collection</h3>
          <RentChart />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
          <h3 className="font-bold text-gray-700 mb-4 text-base">💳 Payment Status</h3>
          <PaymentChart />
        </div>
      </div>

    </MainLayout>
  );
}