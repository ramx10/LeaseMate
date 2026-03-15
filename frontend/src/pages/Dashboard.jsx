import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {

  const [stats, setStats] = useState({});

  useEffect(() => {

    API.get("/dashboard")
      .then(res => {
        setStats(res.data);
      })
      .catch(err => {
        console.log(err);
      });

  }, []);

  return (
    <div style={{padding:"20px"}}>

      <h1>LeaseMate Dashboard</h1>

      <div style={{display:"flex", gap:"20px"}}>

        <div>
          <h3>Total Tenants</h3>
          <p>{stats.totalTenants}</p>
        </div>

        <div>
          <h3>Total Properties</h3>
          <p>{stats.totalProperties}</p>
        </div>

        <div>
          <h3>Total Rooms</h3>
          <p>{stats.totalRooms}</p>
        </div>

        <div>
          <h3>Pending Rent</h3>
          <p>₹{stats.pendingRent}</p>
        </div>

      </div>

    </div>
  );
}