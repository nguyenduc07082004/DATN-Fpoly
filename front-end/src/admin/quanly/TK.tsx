import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ins, { baseURL } from "../../api";
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
} from "@mui/material"; // Import Modal components from MUI

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TK = () => {
  const [salesData, setSalesData] = useState<any>([]);
  const [recentOrders, setRecentOrders] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [topSellers, setTopSellers] = useState<any>([]);
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
  const [productDetails, setProductDetails] = useState<any>(null); // Lưu thông tin chi tiết sản phẩm sau khi gọi API

  const getData = async () => {
    try {
      const response = await ins.get(`${baseURL}/dashboard`);
      const data = response.data;
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

  useEffect(() => {
    getData();
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
      <div>
        {/* Biểu đồ doanh thu */}
        <div className="card shadow-sm mb-4">
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
        <div className="card shadow-sm">
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
                          <button className="btn btn-primary" onClick={() => handleShowModal(product)}>
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
  );
};

export default TK;
