import React, { useEffect, useState } from "react";
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
} from "chart.js";
import ins from "../../api";
import { baseURL } from "../../api";
import { getStatusText } from "../../utils/colorUtils";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrangChu = () => {
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

  console.log(products,"dasok")

  console.log(dataDashboard);
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container-fluid">
      <main className="w-100">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center p-4 bg-white shadow-sm">
          <h1 className="text-primary">Bảng Tổng Hợp</h1>
        </header>

        {/* Statistics Section */}
        <section className="p-4">
          <div className="row g-3 mb-4">
            {/* Tổng đơn hàng */}
            <div className="col-lg-3 col-md-6">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-primary">
                    {stats.totalOrders}
                  </h3>
                  <p className="card-text">Tổng đơn hàng</p>
                </div>
              </div>
            </div>

            {/* Tổng sản phẩm */}
            <div className="col-lg-3 col-md-6">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-success">
                    {stats.totalProducts}
                  </h3>
                  <p className="card-text">Tổng sản phẩm</p>
                </div>
              </div>
            </div>

            {/* Tổng đơn đang chờ */}
            <div className="col-lg-3 col-md-6">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-warning">
                    {stats.totalOrdersPending}
                  </h3>
                  <p className="card-text">Đơn hàng chờ</p>
                </div>
              </div>
            </div>

            {/* Tổng đơn chưa thanh toán */}
            <div className="col-lg-3 col-md-6">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-danger">
                    {stats.totalOrdersUnpaid}
                  </h3>
                  <p className="card-text">Đơn hàng chưa thanh toán</p>
                </div>
              </div>
            </div>

            {/* Tổng doanh thu */}
            <div className="col-lg-3 col-md-6">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-info">
                    {stats.totalRevenue.toLocaleString("vi-VN")} VND
                  </h3>
                  <p className="card-text">Doanh thu</p>
                </div>
              </div>
            </div>

            {/* Tổng đơn hủy */}
            <div className="col-lg-3 col-md-6">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-danger">
                    {stats.totalOrderCancel}
                  </h3>
                  <p className="card-text">Đơn hàng huỷ</p>
                </div>
              </div>
            </div>

            {/* Tổng người dùng */}
            <div className="col-lg-3 col-md-6">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-primary">{stats.totalUser}</h3>
                  <p className="card-text">Số lượng người dùng</p>
                </div>
              </div>
            </div>

            {/* Tổng người dùng online */}
            <div className="col-lg-3 col-md-6">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-success">
                    {stats.totalUserOnline}
                  </h3>
                  <p className="card-text">Người dùng online</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title">Đơn hàng gần đây</h2>
              {/* Kiểm tra nếu đang tải dữ liệu */}
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading...</p>
                </div>
              ) : (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th className="col-2">Mã đơn hàng</th>
                      <th className="col-2">Khách hàng</th>
                      <th className="col-4">Sản phẩm</th>
                      <th className="col-2">Trạng thái</th>
                      <th className="col-2">Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Loop through each order */}
                    {recentOrders.length > 0 &&
                      recentOrders?.map((order) => (
                        <tr key={order._id}>
                          <td className="col-2">{order._id}</td>
                          <td className="col-2">{order.receiver_name}</td>
                          <td className="col-4">
                            {/* Display detailed item information */}
                            {order?.items?.map((item, itemIndex) => (
                              <div key={itemIndex}>
                                {item?.product?.title} ({item?.color},{" "}
                                {item?.storage})
                              </div>
                            ))}
                          </td>
                          <td className="col-2">
                            {/* Show order status */}
                            <span
                              className={`badge ${
                                order?.status === "Completed"
                                  ? "bg-success"
                                  : order?.status === "Pending"
                                  ? "bg-warning"
                                  : order?.status === "In Delivery"
                                  ? "bg-info"
                                  : "bg-danger"
                              }`}
                            >
                              {getStatusText(order?.status)}
                            </span>
                          </td>
                          <td className="col-2">
                            {order?.total_price.toLocaleString("vi-VN")} VND
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        {/* Top Customers */}
        <section className="p-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Cảnh báo tồn kho</h2>
              <ul className="list-group list-group-flush">
                {loading ? (
                  // Hiển thị loading khi dữ liệu chưa được tải
                  <li className="list-group-item text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Đang tải...</span>
                    </div>
                  </li>
                ) : (
                  // Hiển thị sản phẩm khi dữ liệu đã được tải
                  products
                    .filter((product) => product.totalStock < 5).slice(0,10) // Lọc sản phẩm có totalStock < 5
                    .map((product, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {product._id.title}{" "}({product._id.color},{" "}{product._id.storage}{" "})
                        <span className="badge bg-danger">
                          {product.totalStock} Sản phẩm
                        </span>
                      </li>
                    ))
                )}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrangChu;
