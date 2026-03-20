import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PaymentChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchChart = () => {
      axios
        .get("http://localhost:5000/api/dashboard/payment-analytics")
        .then((res) => {
          if (!isMounted) return;
          const paid = res.data.find((d) => d.paid === true)?.count || 0;
          const pending = res.data.find((d) => d.paid === false)?.count || 0;
          setChartData({
            labels: ["Paid", "Pending"],
            datasets: [
              {
                data: [paid, pending],
                backgroundColor: ["#6366f1", "#f59e0b"],
                hoverBackgroundColor: ["#818cf8", "#fbbf24"],
                borderColor: ["#fff", "#fff"],
                borderWidth: 3,
                hoverOffset: 8,
              },
            ],
          });
        })
        .catch((err) => console.log(err));
    };
    fetchChart();
    const interval = setInterval(fetchChart, 15000); // 15s polling
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#6b7280", font: { size: 12, family: "'Inter', sans-serif", weight: '500' }, padding: 20, usePointStyle: true, pointStyle: 'circle' },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        bodyFont: { size: 14, family: "'Inter', sans-serif" },
        callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw} Tenants` },
        cornerRadius: 8,
      }
    },
  };

  if (!chartData) return <div className="text-sm text-gray-400 text-center py-10">Loading chart…</div>;
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>
        <h3 className="font-bold text-slate-700 text-sm">Payment Status</h3>
      </div>
      <div className="w-full relative flex justify-center flex-1" style={{ height: '260px', minHeight: '260px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}