import { useEffect, useState } from "react";
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

import {
  Modal,
  Button,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import Swal from "sweetalert2";

const TrangChu = () => {
  const [salesData, setSalesData] = useState<any>([]);
  const [recentOrders, setRecentOrders] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [topSellers, setTopSellers] = useState<any>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

  const [showModal, setShowModal] = useState(false); // Điều khiển modal
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // Lưu thông tin chi tiết sản phẩm
  const [productDetails, setProductDetails] = useState<any>(null);
  const getData = async (startDate: string , endDate:string) => {
    try {
      const response = await ins.get(
        `${baseURL}/dashboard?startDate=${startDate}&endDate=${endDate}`
      );
      const data = response.data;
      if (response.status === 200) {
        setStats({
          totalOrders: data.total.totalOrders,
          totalProducts: data.total.totalProducts,
          totalOrdersPending: data.total.totalOrdersPending,
          totalOrdersUnpaid: data.total.totalOrdersUnpaid,
          totalRevenue: data.total.totalRevenue > 0 ? data.total.totalRevenue : 0 ,
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
  const getTopSellingProducts = async () => {
    try {
      const response = await ins.get(`${baseURL}/orders/top-selling`);
      const data = response.data;
      if (response.status === 200) {
        setTopSellers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProductDetails = async (productId: string) => {
    try {
      const response = await ins.get(
        `${baseURL}/orders/product-variants/${productId}`
      );
      if (response.status === 200) {
        setProductDetails(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowModal = (product: any) => {
    setSelectedProduct(product);
    getProductDetails(product.product_id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null); 
    setProductDetails(null);
  };

  const handleSearch = async () => {
    if (!startDate && !endDate) {
      await getData('', '');
      return;
    }
    if (!startDate || !endDate) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn ngày bắt đầu và kết thúc",
      });
      return;
    }
    await getData(startDate, endDate);
  };
  

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    getData('', '');
    getTopSellingProducts();
  }, []);

  const chartData = {
    labels: salesData.map((item: any) => item._id),
    datasets: [
      {
        label: "Tổng doanh số (VND)",
        data: salesData.map((item: any) => item.totalSales),
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
        text: "Tổng quan về doanh số",
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
    <div
      className="bg-light rounded-3 content1"
      style={{ height: "170rem", width: "1170px" }}
    >
<section className="p-4">
<div className="shadow-sm text-center card">
  <div className="card-body">
    <h5 className="card-title">Chọn khoảng thời gian</h5>
    
    <div className="mt-3 d-flex justify-content-center align-items-center">
      {/* Ngày bắt đầu */}
      <div className="me-3">
        <label htmlFor="start-date" className="form-label">Ngày bắt đầu</label>
        <input
          id="start-date"
          type="date"
          className="form-control"
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          max={endDate || new Date().toISOString().split('T')[0]} 
        />
      </div>

      {/* Ngày kết thúc */}
      <div className="me-3">
        <label htmlFor="end-date" className="form-label">Ngày kết thúc</label>
        <input
          id="end-date"
          type="date"
          className="form-control"
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          min={startDate} 
          max={new Date().toISOString().split('T')[0]} 
        />
      </div>

      {/* Nút Tìm */}
      <button
        className="btn btn-primary me-2"
        onClick={() => handleSearch()} 
      >
        Tìm
      </button>
      
      {/* Nút Clear */}
      <button
        className="btn btn-secondary"
        onClick={() => handleClear()} 
      >
        Clear
      </button>
    </div>
  </div>
</div>


  <div className="mb-4 row g-3">
    {/* Tổng đơn hàng */}
    <div className="col-lg-3 col-md-6">
      <div className="shadow-sm text-center card">
        <div className="card-body">
          <h3 className="text-primary card-title">{stats.totalOrders}</h3>
          <p className="card-text">Tổng đơn hàng</p>
        </div>
      </div>
    </div>

    {/* Tổng sản phẩm */}
    <div className="col-lg-3 col-md-6">
      <div className="shadow-sm text-center card">
        <div className="card-body">
          <h3 className="text-success card-title">
            {stats.totalProducts}
          </h3>
          <p className="card-text">Tổng sản phẩm</p>
        </div>
      </div>
    </div>

    {/* Tổng đơn đang chờ */}
    <div className="col-lg-3 col-md-6">
      <div className="shadow-sm text-center card">
        <div className="card-body">
          <h3 className="text-warning card-title">
            {stats.totalOrdersPending}
          </h3>
          <p className="card-text">Đơn hàng chờ</p>
        </div>
      </div>
    </div>

    {/* Tổng đơn chưa thanh toán */}
    <div className="col-lg-3 col-md-6">
      <div className="shadow-sm text-center card">
        <div className="card-body">
          <h3 className="text-danger card-title">
            {stats.totalOrdersUnpaid}
          </h3>
          <p className="card-text">Đơn hàng chưa thanh toán</p>
        </div>
      </div>
    </div>

    {/* Tổng doanh thu */}
    <div className="col-lg-3 col-md-6">
      <div className="shadow-sm text-center card">
        <div className="card-body">
          <h3 className="text-info card-title">
            {stats.totalRevenue.toLocaleString("vi-VN")} VND
          </h3>
          <p className="card-text">Doanh thu</p>
        </div>
      </div>
    </div>

    {/* Tổng đơn hủy */}
    <div className="col-lg-3 col-md-6">
      <div className="shadow-sm text-center card">
        <div className="card-body">
          <h3 className="text-danger card-title">
            {stats.totalOrderCancel}
          </h3>
          <p className="card-text">Đơn hàng huỷ</p>
        </div>
      </div>
    </div>

    {/* Tổng người dùng */}
    <div className="col-lg-3 col-md-6">
      <div className="shadow-sm text-center card">
        <div className="card-body">
          <h3 className="text-primary card-title">{stats.totalUser}</h3>
          <p className="card-text">Số lượng người dùng</p>
        </div>
      </div>
    </div>

    {/* Tổng người dùng online */}
    <div className="col-lg-3 col-md-6">
      <div className="shadow-sm text-center card">
        <div className="card-body">
          <h3 className="text-success card-title">
            {stats.totalUserOnline}
          </h3>
          <p className="card-text">Người dùng online</p>
        </div>
      </div>
    </div>
  </div>
</section>


      <section className="p-4">
        <div>
          {/* Biểu đồ doanh thu */}
          <div className="shadow-sm mb-4 card">
            <div className="card-body">
              <h2 className="card-title">Doanh thu bán hàng</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Line data={chartData} options={options as any} />
              )}
            </div>
          </div>

          {/* Bảng thống kê Top 5 sản phẩm bán chạy nhất */}
          <div className="shadow-sm card">
            <div className="card-body">
              <h2 className="card-title">Top 5 Sản Phẩm Bán Chạy Nhất</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">STT</th>
                      <th scope="col">Tên sản phẩm</th>
                      <th scope="col">Số lượng bán</th>
                      <th scope="col">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellers.length > 0 &&
                      topSellers.slice(0, 5).map((product, index) => (
                        <tr key={product.product_id}>
                          <th scope="row">{index + 1}</th>
                          <td>{product.name}</td>
                          <td>{product.totalSold}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleShowModal(product)}
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Modal hiển thị thông tin chi tiết sản phẩm */}
        <Modal
          open={showModal}
          onClose={handleCloseModal}
          aria-labelledby="product-modal-title"
          aria-describedby="product-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              maxWidth: 800,
              width: "100%",
            }}
          >
            <Typography id="product-modal-title" variant="h6" component="h2">
              Chi tiết sản phẩm
            </Typography>
            {productDetails ? (
              <div>
                <p>
                  <strong>Tên sản phẩm:</strong>{" "}
                  {
                    topSellers.find(
                      (p: any) => p.product_id === selectedProduct.product_id
                    ).name
                  }
                </p>
                <p>
                  <strong>Số lượng bán:</strong>{" "}
                  {
                    topSellers.find(
                      (p: any) => p.product_id === selectedProduct.product_id
                    ).totalSold
                  }
                </p>
                <p>
                  <strong>Thông tin chi tiết:</strong>
                </p>

                {/* Bảng hiển thị chi tiết sản phẩm */}
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table
                    sx={{ minWidth: 650 }}
                    aria-label="product details table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Số lượng</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Bộ nhớ</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Màu</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productDetails.length > 0 ? (
                        productDetails.map((detail: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{detail.totalQuantity}</TableCell>
                            <TableCell>{detail.storage}</TableCell>
                            <TableCell>{detail.color}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography variant="body2" color="textSecondary">
                              Không có chi tiết nào.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : null}
            <Button onClick={handleCloseModal} color="primary">
              Đóng
            </Button>
          </Box>
        </Modal>
      </section>
      <section className="p-4">
        <div className="shadow-sm mb-4 card">
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

      <section className="p-4">
        <div className="shadow-sm card">
          <div className="card-body">
            <h2 className="card-title">Cảnh báo hết hàng</h2>
            <ul className="list-group list-group-flush">
              {loading ? (
                // Hiển thị loading khi dữ liệu chưa được tải
                <li className="list-group-item text-center">
                  <div className="text-primary spinner-border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </li>
              ) : (
                // Hiển thị sản phẩm khi dữ liệu đã được tải
                products
                  .filter((product) => product.totalStock < 5)
                  .slice(0, 10) // Lọc sản phẩm có totalStock < 5
                  .map((product, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {product._id.title} ({product._id.color},{" "}
                      {product._id.storage} )
                      <span className="bg-danger badge">
                        {product.totalStock} Sản phẩm
                      </span>
                    </li>
                  ))
              )}
            </ul>
          </div>
        </div>
      </section>

      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="product-modal-title"
        aria-describedby="product-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            maxWidth: 800,
            width: "100%",
          }}
        >
          <Typography id="product-modal-title" variant="h6" component="h2">
            Chi tiết sản phẩm
          </Typography>
          {productDetails ? (
            <div>
              <p>
                <strong>Tên sản phẩm:</strong>{" "}
                {
                  topSellers.find(
                    (p: any) => p.product_id === selectedProduct.product_id
                  ).name
                }
              </p>
              <p>
                <strong>Số lượng bán:</strong>{" "}
                {
                  topSellers.find(
                    (p: any) => p.product_id === selectedProduct.product_id
                  ).totalSold
                }
              </p>
              <p>
                <strong>Thông tin chi tiết:</strong>
              </p>

              {/* Bảng hiển thị chi tiết sản phẩm */}
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table
                  sx={{ minWidth: 650 }}
                  aria-label="product details table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Số lượng</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Bộ nhớ</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Màu</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productDetails.length > 0 ? (
                      productDetails.map((detail: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{detail.totalQuantity}</TableCell>
                          <TableCell>{detail.storage}</TableCell>
                          <TableCell>{detail.color}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="body2" color="textSecondary">
                            Không có chi tiết nào.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : null}
          <Button onClick={handleCloseModal} color="primary">
            Đóng
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TrangChu;
