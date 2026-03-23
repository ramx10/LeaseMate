import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function RentChart() {
  const [rawData, setRawData] = useState([]);
  const [filter, setFilter] = useState("6");

  useEffect(() => {
    let isMounted = true;
    const fetchChart = () => {
      axios
        .get("http://localhost:5000/api/dashboard/rent-analytics")
        .then((res) => {
          if (isMounted) setRawData(res.data);
        })
        .catch((err) => console.log(err));
    };
    fetchChart();
    const interval = setInterval(fetchChart, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const displayData = filter === "all" ? rawData : rawData.slice(-parseInt(filter));

  const chartData = rawData.length > 0 ? {
    labels: displayData.map((r) => r.month),
    datasets: [
      {
        label: "Rent Collected (₹)",
        data: displayData.map((r) => r.total_rent),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.08)",
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
        borderWidth: 2.5,
      },
    ],
  } : null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
        callbacks: { label: (ctx) => `₹ ${ctx.raw}` },
        cornerRadius: 8,
      },
    },
    scales: {
      y: { 
        grid: { color: "rgba(0,0,0,0.04)" }, 
        ticks: { color: "#9ca3af", font: { family: "'Inter', sans-serif", size: 11 }, padding: 8 },
        border: { display: false }
      },
      x: { 
        grid: { display: false }, 
        ticks: { color: "#9ca3af", font: { family: "'Inter', sans-serif", size: 11 }, padding: 8 },
        border: { display: false }
      },
    },
  };

  if (!chartData) return <div className="text-sm text-gray-400 text-center py-10">Loading chart…</div>;
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <h3 className="font-bold text-slate-700 text-sm">Monthly Rent Collection</h3>
        </div>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 cursor-pointer outline-none transition-colors hover:bg-slate-100"
        >
          <option value="3">Last 3 Months</option>
          <option value="6">Last 6 Months</option>
          <option value="12">Last 12 Months</option>
          <option value="all">All Time</option>
        </select>
      </div>
      <div className="w-full relative flex-1" style={{ height: '260px', minHeight: '260px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}