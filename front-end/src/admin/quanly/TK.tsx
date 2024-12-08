import React, { useContext, useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
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
import ins, { baseURL } from "../../api";
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
  const [dataDashboard, setDataDashBoard] = useState<any>([]);
  const [salesData, setSalesData] = useState<any>([]);
  const [recentOrders, setRecentOrders] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalOrdersPending: 0,
    totalOrdersUnpaid: 0,
    totalRevenue: 0,
    totalOrderCancel: 0,
    totalUser: 0,
    totalUserOnline: 0,
  });

  const getData = async () => {
    try {
      const response = await ins.get(`${baseURL}/dashboard`);
      const data = response.data;
      console.log(data);
      if (response.status === 200) {
        const totalRevenue =
          data.total.totalRevenue.length > 0
            ? data.total.totalRevenue[0].total
            : 0;
        setStats({
          totalOrders: data.total.totalOrders,
          totalProducts: data.total.totalProducts,
          totalOrdersPending: data.total.totalOrdersPending,
          totalOrdersUnpaid: data.total.totalOrdersUnpaid,
          totalRevenue: totalRevenue,
          totalOrderCancel: data.total.totalOrderCancel,
          totalUser: data.total.totalUser,
          totalUserOnline: data.total.totalUserOnline,
        });
        setSalesData(data.salesData);
        setRecentOrders(data.recentOrders);
        setProducts(data.products);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const chartData = {
    labels: salesData.map((item) => item._id),
    datasets: [
      {
        label: "Tổng doanh số (VND)",
        data: salesData.map((item) => item.totalSales),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Tổng quan về doanh số theo ngày",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
      y: {
        title: {
          display: true,
          text: "Tổng doanh số (VND)",
        },
        beginAtZero: true,
      },
    },
  };
  return (
    <section className="p-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="card-title">Doanh thu bán hàng</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Line data={chartData} options={options} />
          )}
        </div>
      </div>
    </section>
  );
};

export default TK;
