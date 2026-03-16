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

export default function RentChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/rent-analytics")
      .then((res) => {
        const labels = res.data.map((r) => r.month);
        const values = res.data.map((r) => r.total_rent);
        setChartData({
          labels,
          datasets: [
            {
              label: "Rent Collected (₹)",
              data: values,
              backgroundColor: "rgba(99,102,241,0.7)",
              borderColor: "#6366f1",
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `₹ ${ctx.raw}` } },
    },
    scales: {
      y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { color: "#6b7280" } },
      x: { grid: { display: false }, ticks: { color: "#6b7280" } },
    },
  };

  if (!chartData) return <div className="text-sm text-gray-400 text-center py-10">Loading chart…</div>;
  return <Bar data={chartData} options={options} />;
}