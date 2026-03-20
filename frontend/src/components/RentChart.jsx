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
    <div className="w-full relative" style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}