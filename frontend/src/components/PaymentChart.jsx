import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PaymentChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/payment-analytics")
      .then((res) => {
        const paid = res.data.find((d) => d.paid === true)?.count || 0;
        const pending = res.data.find((d) => d.paid === false)?.count || 0;
        setChartData({
          labels: ["Paid", "Pending"],
          datasets: [
            {
              data: [paid, pending],
              backgroundColor: ["#6366f1", "#f59e0b"],
              borderColor: ["#fff", "#fff"],
              borderWidth: 3,
              hoverOffset: 6,
            },
          ],
        });
      })
      .catch((err) => console.log(err));
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
    <div className="w-full relative flex justify-center" style={{ height: '300px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}