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
 Legend
} from "chart.js";

ChartJS.register(
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend
);

export default function RentChart() {

 const [chartData, setChartData] = useState({});

 useEffect(() => {

  axios.get("http://localhost:5000/api/dashboard/rent-analytics")
   .then(res => {

    const labels = res.data.map(r => r.month);
    const values = res.data.map(r => r.total_rent);

    setChartData({
      labels,
      datasets: [
        {
          label: "Rent Collection",
          data: values
        }
      ]
    });

   });

 }, []);

 return (
  <div className="bg-white p-5 rounded shadow">
   <h2 className="text-xl font-bold mb-4">
     Monthly Rent Collection
   </h2>

   {chartData.labels && <Bar data={chartData} />}
  </div>
 );
}