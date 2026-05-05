import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import StatsCard from "../components/StatsCard";
import RoomCard from "../components/RoomCard";
import RentChart from "../components/RentChart";
import PaymentChart from "../components/PaymentChart";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        const [statsRes, propsRes, roomsRes, tenantsRes, ledgerRes] = await Promise.all([
          axios.get("/api/dashboard"),
          axios.get("/api/properties"),
          axios.get("/api/rooms"),
          axios.get("/api/tenants"),
          axios.get("/api/ledger"),
        ]);
        if (isMounted) {
          setStats(statsRes.data);
          setProperties(propsRes.data);
          setRooms(roomsRes.data);
          setTenants(tenantsRes.data);
          setLedger(ledgerRes.data);
        }
      } catch (err) {
        console.log("Error loading dashboard data:", err);
        setErrorMsg(err.response ? JSON.stringify(err.response.data) : err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAll();
    const interval = setInterval(() => fetchAll(true), 15000); // Poll every 15s for real-time updates
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Build a map from room → tenants with payment status
  const buildPropertyRoomHierarchy = () => {
    const roomMap = {};
    rooms.forEach((room) => {
      roomMap[room.id] = {
        ...room,
        tenants: [],
      };
    });

    tenants.forEach((tenant) => {
      if (roomMap[tenant.room_id]) {
        // Find latest ledger entry for this tenant
        const tenantLedger = ledger.filter(
          (l) => l.tenant_id === tenant.id
        );
        const latestPayment = tenantLedger.length > 0 ? tenantLedger[tenantLedger.length - 1] : null;

        let status = "pending";
        if (latestPayment) {
          if (latestPayment.paid) status = "paid";
          else if (latestPayment.amount_paid > 0) status = "partial";
          else status = "pending";
        }

        roomMap[tenant.room_id].tenants.push({
          id: tenant.id,
          name: tenant.tenant_name || "Unknown",
          status,
        });
      }
    });

    // Group rooms by property
    const propertyMap = {};
    properties.forEach((prop) => {
      propertyMap[prop.id] = {
        ...prop,
        rooms: [],
      };
    });

    Object.values(roomMap).forEach((room) => {
      if (propertyMap[room.property_id]) {
        propertyMap[room.property_id].rooms.push(room);
      }
    });

    return Object.values(propertyMap);
  };

  const hierarchy = loading ? [] : buildPropertyRoomHierarchy();

  // Calculate paid rent from stats
  const paidRent =
    stats.totalRooms !== undefined
      ? "₹ " + (stats.paid_rent || "0")
      : "₹ 0";

  const handleMarkPayment = (room) => {
    // Navigate to ledger or open modal
    window.location.href = "/ledger";
  };

  return (
    <MainLayout title="Dashboard">
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMsg}</span>
        </div>
      )}
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 lg:p-8 mb-8 text-white relative overflow-hidden animate-fade-in-up transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.3)] group cursor-default"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #3b82f6 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-125"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
        />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-[0.06] transition-transform duration-700 group-hover:scale-150"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="transition-transform duration-300 group-hover:translate-x-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl animate-bounce-slow">👋</span>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Welcome back, Owner</h1>
            </div>
            <p className="text-indigo-100 text-sm lg:text-base mt-2 max-w-lg leading-relaxed">
              Experience the future of property management. Your portfolio is performing excellently today.
            </p>
          </div>
          
          {/* Quick Stats in Banner */}
          <div className="hidden lg:flex items-center gap-8 pr-4">
            <div className="text-center">
              <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Active Rooms</p>
              <p className="text-2xl font-bold">{stats.totalRooms || 0}</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Total Residents</p>
              <p className="text-2xl font-bold">{stats.totalTenants || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        <div className="delay-1 animate-fade-in-up">
          <StatsCard
            title="Total Properties"
            value={stats.totalProperties}
            icon="🏠"
            gradient="linear-gradient(135deg, #6366f1, #818cf8)"
          />
        </div>
        <div className="delay-2 animate-fade-in-up">
          <StatsCard
            title="Total Tenants"
            value={stats.totalTenants}
            icon="👤"
            gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
          />
        </div>
        <div className="delay-3 animate-fade-in-up">
          <StatsCard
            title="Rent Collected"
            value={paidRent}
            icon="💰"
            gradient="linear-gradient(135deg, #10b981, #34d399)"
          />
        </div>
        <div className="delay-4 animate-fade-in-up">
          <StatsCard
            title="Pending Rent"
            value={"₹ " + (stats.pending_rent || 0)}
            icon="⏳"
            gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
          />
        </div>
        <div className="delay-5 animate-fade-in-up">
          <StatsCard
            title="Electricity Due"
            value={"₹ " + (stats.electricity_due || 0)}
            icon="⚡"
            gradient="linear-gradient(135deg, #ef4444, #f87171)"
          />
        </div>
        <div className="delay-6 animate-fade-in-up">
          <StatsCard
            title="Open Issues"
            value={stats.open_issues || 0}
            icon="🔧"
            gradient="linear-gradient(135deg, #e11d48, #fb7185)"
          />
        </div>
      </div>

      {/* Property & Room Cards Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Properties & Rooms</h2>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Manage tenant payments across all your properties</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">{properties.length} properties</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-400">{rooms.length} rooms</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse shadow-[var(--shadow-sm)]">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-3 bg-slate-100 rounded w-2/3 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : hierarchy.length === 0 ? (
          <div
            className="bg-white rounded-2xl p-10 text-center shadow-[var(--shadow-sm)]"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <h3 className="text-slate-700 font-semibold text-base">No properties yet</h3>
            <p className="text-slate-400 text-sm mt-1">Add a property to start managing rooms and tenants.</p>
          </div>
        ) : (
          hierarchy.map((property, propIdx) => (
            <div key={property.id} className={`mb-6 animate-fade-in-up delay-${propIdx + 1}`}>
              {/* Property header */}
              <div className="flex items-center gap-3 mb-4 group/prop cursor-default transition-all duration-300 hover:translate-x-1">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover/prop:scale-110"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 3px 8px rgba(99,102,241,0.3)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{property.name}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {property.address || property.area || "—"} • {property.rooms?.length || 0} rooms
                  </p>
                </div>
              </div>

              {/* Room cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pl-11">
                {property.rooms && property.rooms.length > 0 ? (
                  property.rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onMarkPayment={handleMarkPayment}
                    />
                  ))
                ) : null}

                {/* Quick Insights Card */}
                <div className="flex flex-col justify-center p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-100 shadow-[var(--shadow-sm)] hover:shadow-md transition-shadow">
                  <h4 className="text-slate-700 text-sm font-bold mb-4 flex items-center gap-2">
                    <span className="text-indigo-500">📊</span> Quick Insights
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Total Capacity</span>
                      <span className="font-semibold text-slate-700">
                        {property.rooms?.reduce((acc, r) => acc + (r.max_tenants || 0), 0) || 0} Beds
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Current Tenants</span>
                      <span className="font-semibold text-slate-700">
                        {property.rooms?.reduce((acc, r) => acc + (r.tenants?.length || 0), 0) || 0} Residents
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                      {(() => {
                        const capacity = property.rooms?.reduce((acc, r) => acc + (r.max_tenants || 0), 0) || 0;
                        const current = property.rooms?.reduce((acc, r) => acc + (r.tenants?.length || 0), 0) || 0;
                        const pct = capacity > 0 ? (current / capacity) * 100 : 0;
                        return (
                          <div className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }}></div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Add Room Placeholder */}
                <div
                  onClick={() => window.location.href = '/rooms'}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer group"
                  style={{ minHeight: "160px" }}
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-[var(--shadow-sm)] group-hover:scale-110 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                  <p className="font-medium text-sm text-slate-600 group-hover:text-indigo-700">Add New Room</p>
                  <p className="text-[11px] opacity-70 mt-1">Expand {property.name}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-2xl p-6 animate-fade-in-up delay-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] cursor-default"
        >
          <div className="mb-2">
            <RentChart />
          </div>
        </div>
        <div
          className="bg-white rounded-2xl p-6 animate-fade-in-up delay-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] cursor-default"
        >
          <div className="mb-2">
            <PaymentChart />
          </div>
        </div>
      </div>

    </MainLayout>
  );
}
