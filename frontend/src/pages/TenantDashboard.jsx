import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import StatsCard from "../components/StatsCard";
import TenantSpendingTrend from "../components/TenantSpendingTrend";
import { useAuth } from "../context/AuthContext";

export default function TenantDashboard() {
  const [data, setData] = useState({
    rentBreakdown: null,
    totalSpent: 0,
    electricityHistory: [],
    recentSharedExpenses: [],
    deposit: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tenant-dashboard")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <MainLayout title="Tenant Dashboard">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  // Calculate electricity usage difference if there are at least 2 records
  let electricityTrend = null;
  if (data.electricityHistory && data.electricityHistory.length >= 2) {
    const currentUnits = data.electricityHistory[0].total_units;
    const previousUnits = data.electricityHistory[1].total_units;
    const diff = currentUnits - previousUnits;
    if (diff > 0) {
      electricityTrend = `Increased by ${diff} units`;
    } else if (diff < 0) {
      electricityTrend = `Decreased by ${Math.abs(diff)} units`;
    } else {
      electricityTrend = "No change in usage";
    }
  }

  return (
    <MainLayout title="Tenant Dashboard">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 mb-8 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #3b82f6 60%, #0ea5e9 100%)" }}
      >
        <div className="absolute right-6 top-0 h-full opacity-10 flex items-center text-9xl select-none">👤</div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || "Tenant"} 👋</h1>
        <p className="text-indigo-100 mt-1 text-sm">Here is your expense overview for the current month.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatsCard
          title="Total Spent"
          value={"₹ " + data.totalSpent}
          icon="💸"
          gradient="linear-gradient(135deg, #6366f1, #818cf8)"
        />
        <StatsCard
          title="Security Deposit"
          value={"₹ " + (data.deposit || 0)}
          icon="🛡️"
          gradient="linear-gradient(135deg, #10b981, #34d399)"
        />
        <StatsCard
          title="Current Rent Bill"
          value={"₹ " + (data.rentBreakdown && data.rentBreakdown.status !== "Paid" ? data.rentBreakdown.total_amount : 0)}
          icon="📜"
          gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
        />
        <StatsCard
          title="Rent Status"
          value={data.rentBreakdown ? data.rentBreakdown.status : "N/A"}
          icon="💳"
          gradient={
            data.rentBreakdown?.status === "Paid" 
              ? "linear-gradient(135deg, #10b981, #34d399)" 
              : "linear-gradient(135deg, #ef4444, #f87171)"
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Rent Breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
          <h3 className="font-bold text-gray-700 mb-4 text-base">📊 This Month's Breakdown</h3>
          {data.rentBreakdown ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl">
                <span className="text-indigo-900 font-medium">Rent</span>
                <span className="text-indigo-900 font-bold">₹ {data.rentBreakdown.rent_amount}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl">
                <span className="text-amber-900 font-medium">Electricity</span>
                <span className="text-amber-900 font-bold">₹ {data.rentBreakdown.electricity_amount}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-900 font-bold">Total Dues</span>
                <span className="text-emerald-900 font-bold text-lg">₹ {data.rentBreakdown.total_amount}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No rent bill generated for this month yet.</p>
          )}

          {/* Electricity Usage */}
          {electricityTrend && (
            <div className="mt-6 p-4 rounded-xl border border-blue-100 bg-blue-50/50">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">⚡ Electricity Usage Insight</h4>
              <p className="text-sm text-blue-800">
                Your room's electricity usage has <span className="font-bold">{electricityTrend}</span> compared to the previous month.
              </p>
            </div>
          )}
        </div>

        {/* Shared Expenses */}
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700 text-base">🛒 Recent Shared Expenses</h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded-lg">Room</span>
          </div>
          
          {data.recentSharedExpenses && data.recentSharedExpenses.length > 0 ? (
            <div className="space-y-3">
              {data.recentSharedExpenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{expense.expense_name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Paid by <span className="font-medium text-indigo-600">{expense.paid_by_name}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">₹ {expense.amount}</span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(expense.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2 opacity-50">💸</div>
              <p className="text-gray-500 text-sm">No shared expenses recorded recently.</p>
            </div>
          )}
        </div>
      </div>

      {/* Expense Charts Section */}
      <div className="mt-6">
        <div
          className="bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] cursor-default"
        >
          <TenantSpendingTrend />
        </div>
      </div>

    </MainLayout>
  );
}
