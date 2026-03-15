import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import StatsCard from "../components/StatsCard";

export default function Dashboard() {

  const [stats, setStats] = useState({});

  useEffect(() => {

    axios.get("http://localhost:5000/api/dashboard")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));

  }, []);

  return (

    <MainLayout>

      <div className="grid grid-cols-4 gap-6">

        <StatsCard
          title="Total Tenants"
          value={stats.totalTenants}
        />

        <StatsCard
          title="Total Properties"
          value={stats.totalProperties}
        />

        <StatsCard
          title="Total Rooms"
          value={stats.totalRooms}
        />

        <StatsCard
          title="Pending Rent"
          value={"₹ " + stats.pendingRent}
        />

      </div>

    </MainLayout>

  );
}