import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TenantExpenseChart() {
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tenant-dashboard/expense-analytics")
      .then((res) => setRawData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const chartData = rawData.length > 0 ? {
    labels: rawData.map((r) => r.month),
    datasets: [
      {
        label: "Rent (₹)",
        data: rawData.map((r) => r.rent),
        backgroundColor: "rgba(99,102,241,0.75)",
        hoverBackgroundColor: "rgba(99,102,241,1)",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Electricity (₹)",
        data: rawData.map((r) => r.electricity),
        backgroundColor: "rgba(245,158,11,0.75)",
        hoverBackgroundColor: "rgba(245,158,11,1)",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  } : null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#6b7280",
          font: { size: 12, family: "'Inter', sans-serif", weight: "500" },
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        padding: 12,
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.raw}` },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        stacked: true,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { color: "#9ca3af", font: { family: "'Inter', sans-serif", size: 11 }, padding: 8 },
        border: { display: false },
      },
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: "#9ca3af", font: { family: "'Inter', sans-serif", size: 11 }, padding: 8 },
        border: { display: false },
      },
    },
  };

  if (!chartData) return <div className="text-sm text-gray-400 text-center py-10">No expense data yet</div>;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </div>
        <h3 className="font-bold text-slate-700 text-sm">Rent vs Electricity</h3>
      </div>
      <div className="w-full relative flex-1" style={{ height: "260px", minHeight: "260px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
