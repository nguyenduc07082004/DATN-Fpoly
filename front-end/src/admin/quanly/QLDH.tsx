import { useContext, useEffect, useState } from "react";
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
  TablePagination, // Thêm TablePagination
} from "@mui/material";
import {
  getStatusColor,
  getButtonClass,
  getPaymentStatusColor,
  getStatusText,
} from "../../utils/colorUtils";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const QLDH = () => {
  const { state, fetchOrder, updateOrderStatus, updatePaymentStatus } =
    useContext(OrderContext) as OrderContextType;

  // Thêm state cho phân trang
  const [page, setPage] = useState(1); // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(10); // Số lượng đơn hàng mỗi trang

  useEffect(() => {
    // Gọi fetchOrder khi page hoặc rowsPerPage thay đổi
    fetchOrder(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrder(page, rowsPerPage); // Cập nhật lại đơn hàng sau khi thay đổi trạng thái
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
      fetchOrder(page, rowsPerPage); // Cập nhật lại danh sách đơn hàng sau khi thay đổi trạng thái thanh toán
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

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1); // Pagination trong MUI bắt đầu từ 0
  };

  // Hàm xử lý thay đổi số lượng hàng mỗi trang
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset về trang đầu khi thay đổi số hàng mỗi trang
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
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
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
                                title: `Chuyển trạng thái sang ${getStatusText(
                                  status
                                )}?`,
                                text: "Bạn có chắc chắn muốn thay đổi trạng thái không?",
                                confirmButtonText: "Có, thay đổi!",
                                cancelButtonText: "Hủy",
                                showCancelButton: true,
                                preConfirm: () => {
                                  handleStatusChange(order._id, status);
                                },
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  Swal.fire(
                                    "Thành công!",
                                    `Trạng thái đã được chuyển sang ${getStatusText(
                                      status
                                    )}.`,
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
                    <button
                      style={{
                        display:
                         "inline-block",
                      }}
                      className="btn btn-sm"
                    >
                      <span
                        style={{
                          color: getPaymentStatusColor(order.payment_status),
                        }}
                      >
                        {order.payment_status === "paid"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </span>
                    </button>
                  </Typography>
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
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={state.totalOrders}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số lượng mỗi trang"
      />
    </div>
  );
};

export default QLDH;
