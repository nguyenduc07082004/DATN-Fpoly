import { useContext, useEffect } from "react";
import {
  OrderContext,
  OrderContextType,
} from "../../api/contexts/OrdersContext";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import {
  getStatusColor,
  getButtonClass,
  getPaymentStatusColor,
  getPaymentStatusButtonClass,
  getStatusText
} from "../../utils/colorUtils";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const QLDH = () => {
  const { state, fetchOrder, updateOrderStatus, updatePaymentStatus } =
    useContext(OrderContext) as OrderContextType;
  useEffect(() => {
    fetchOrder();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrder();
    } catch (error) {
      console.error("Cập nhật trạng thái đơn hàng thất bại: ", error);
    }
  };

  const handlePaymentStatusChange = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      await updatePaymentStatus(orderId, newStatus);
      fetchOrder();
    } catch (error) {
      console.error("Cập nhật trạng thái thanh toán thất bại: ", error);
    }
  };

  if (!state || !Array.isArray(state.products)) {
    return <div>Không có đơn hàng nào để hiển thị</div>;
  }

  // Kiểu StatusKey được khai báo để đảm bảo order.status có kiểu hợp lệ
  type StatusKey =
    | "Pending"
    | "Confirmed"
    | "In Delivery"
    | "Delivered"
    | "Cancelled";

  // Đảm bảo statusOptions được định nghĩa đúng kiểu
  const statusOptions: Record<StatusKey, string[]> = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["In Delivery", "Cancelled"],
    "In Delivery": ["Delivered"],
    Delivered: [],
    Cancelled: [],
  };

  

  return (
    <div className="order-management">
      <Typography variant="h4" className="m-3">
        Quản lý đơn hàng
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Người mua hàng</TableCell>
              <TableCell>Địa chỉ giao hàng</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thanh toán</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.products.map((order, index) => (
              <TableRow key={order._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.receiver_name}</TableCell>
                <TableCell>{order.receiver_address}</TableCell>
                <TableCell>{order.receiver_phone}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Trạng thái hiện tại:</strong>{" "}
                    <span style={{ color: getStatusColor(order.status) }}>
                      {getStatusText(order.status)}
                    </span>
                  </Typography>
                  <div style={{ marginTop: "10px" }}>
                    {order.status in statusOptions &&
                      statusOptions[order.status as StatusKey].map(
                        (status: string) => (
                          <button
                            key={status}
                            className={getButtonClass(status)}
                            onClick={() => {
                              Swal.fire({
                                title: `Chuyển trạng thái sang ${getStatusText(status)}?`,
                                text: "Bạn có chắc chắn muốn thay đổi trạng thái không?",
                                confirmButtonText: "Có, thay đổi!",
                                cancelButtonText: "Hủy",
                                showCancelButton: true,
                                preConfirm: () => {
                                  handleStatusChange(order._id, getStatusText(status));
                                },
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  Swal.fire(
                                    "Thành công!",
                                    `Trạng thái đã được chuyển sang ${getStatusText(status)}.`,
                                    "success"
                                  );
                                } else {
                                  console.log("Hủy thay đổi trạng thái");
                                }
                              });
                            }}
                          >
                            {getStatusText(status)}
                          </button>
                        )
                      )}
                  </div>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Trạng thái thanh toán:</strong>{" "}
                    <span
                      style={{
                        color: getPaymentStatusColor(order.payment_status),
                      }}
                    >
                      {order.payment_status === "paid"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </span>
                  </Typography>

                  <div style={{ marginTop: "10px" }}>
                    {order.payment_status === "paid" ? (
                      <button
                        className={getPaymentStatusButtonClass("unpaid")}
                        onClick={() => {
                          Swal.fire({
                            title:
                              "Chuyển trạng thái thanh toán sang Chưa thanh toán?",
                            text: "Bạn có chắc chắn muốn thay đổi trạng thái thanh toán không?",
                            confirmButtonText: "Có, thay đổi!",
                            cancelButtonText: "Hủy",
                            showCancelButton: true,
                            preConfirm: () => {
                              handlePaymentStatusChange(order._id, "unpaid");
                            },
                          }).then((result) => {
                            if (result.isConfirmed) {
                              Swal.fire(
                                "Thành công!",
                                "Trạng thái thanh toán đã được chuyển sang Chưa thanh toán.",
                                "success"
                              );
                            } else {
                              console.log("Hủy thay đổi thanh toán");
                            }
                          });
                        }}
                        style={{
                          display:
                            order.status === "Cancelled" ||
                            order.status === "Delivered"
                              ? "none"
                              : "inline-block",
                        }}
                      >
                        Chưa thanh toán
                      </button>
                    ) : (
                      <button
                        className={getPaymentStatusButtonClass("paid")}
                        onClick={() => {
                          Swal.fire({
                            title:
                              "Chuyển trạng thái thanh toán sang Đã thanh toán?",
                            text: "Bạn có chắc chắn muốn thay đổi trạng thái thanh toán không?",
                            confirmButtonText: "Có, thay đổi!",
                            cancelButtonText: "Hủy",
                            showCancelButton: true,
                            preConfirm: () => {
                              handlePaymentStatusChange(order._id, "paid");
                            },
                          }).then((result) => {
                            if (result.isConfirmed) {
                              Swal.fire(
                                "Thành công!",
                                "Trạng thái thanh toán đã được chuyển sang Đã thanh toán.",
                                "success"
                              );
                            } else {
                              console.log("Hủy thay đổi thanh toán");
                            }
                          });
                        }}
                        style={{
                          display:
                            order.status === "Cancelled" ||
                            order.status === "Delivered"
                              ? "none"
                              : "inline-block",
                        }}
                      >
                        Đã thanh toán
                      </button>
                    )}
                  </div>
                </TableCell>

                <TableCell>{order.created_at.slice(0, 10)}</TableCell>
                <TableCell>
                  <Link to={`/admin/qldh/${order._id}`}>
                    <Button variant="contained" color="info" size="small">
                      Xem
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default QLDH;
