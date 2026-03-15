import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
 Chart as ChartJS,
 ArcElement,
 Tooltip,
 Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PaymentChart() {

 const [chartData, setChartData] = useState({});

 useEffect(() => {

  axios.get("http://localhost:5000/api/dashboard/payment-analytics")
   .then(res => {

    const paid = res.data.find(d => d.paid === true)?.count || 0;
    const pending = res.data.find(d => d.paid === false)?.count || 0;

    setChartData({
      labels: ["Paid", "Pending"],
      datasets: [
        {
          data: [paid, pending]
        }
      ]
    });

   });

 }, []);

 return (
  <div className="bg-white p-5 rounded shadow">
   <h2 className="text-xl font-bold mb-4">
     Payment Status
   </h2>

   {chartData.labels && <Pie data={chartData} />}
  </div>
 );
}