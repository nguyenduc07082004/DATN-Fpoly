import React, { useContext } from "react";
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
import { ProdContext } from "../../api/contexts/ProductsContexts";
import { CategoryContext } from "../../api/contexts/CategoryContext";
// Import the CSS file

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TK = () => {
  // const data = {
  //   labels: ["January", "February", "March", "April", "May", "June", "July"],
  //   datasets: [
  //     {
  //       label: "Sales",
  //       data: [65, 59, 80, 81, 56, 55, 40],
  //       backgroundColor: "rgba(75, 192, 192, 0.2)",
  //       borderColor: "rgba(75, 192, 192, 1)",
  //       borderWidth: 1,
  //     },
  //   ],
  // };
  const { state } = useContext(ProdContext);

  const data = {
    labels: state.products.map((product) => product.title),
    datasets: [
      {
        label: "Category Data",
        data: state.products.map((product) => product.price), // Adjust this line based on your actual data structure
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Sales Data",
      },
    },
  };
  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default TK;
