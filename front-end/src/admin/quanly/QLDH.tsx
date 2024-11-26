import { useContext, useEffect, useState } from "react";
import {
  OrderContext,
  OrderContextType,
} from "../../api/contexts/OrdersContext";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { baseURL } from "../../api";

const QLDH = () => {
  const { state, fetchOrder, updateOrderStatus , updatePaymentStatus } = useContext(
    OrderContext
  ) as OrderContextType;
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);

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

  const openModal = (order: any) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalOpen(false);
  };

  if (!state || !Array.isArray(state.products)) {
    return <div>Không có đơn hàng nào để hiển thị</div>;
  }

  const statusOptions = ["Pending", "In Delivery", "Delivered", "Cancelled"];
  const handlePaymentStatusChange = async (orderId:string, newStatus:string) => {
    await updatePaymentStatus(orderId, newStatus);
  };

  return (
    <div className="order-management">
      <h2 className="m-3">Quản lý đơn hàng</h2>
      <table className="table table-bordered">
        <thead className="text-center">
          <tr>
            <th>#</th>
            <th>Mã đơn hàng</th>
            <th>Người mua hàng</th>
            <th>Địa chỉ giao hàng</th>
            <th>Số điện thoại</th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th>Ngày đặt</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {state.products &&
            state.products.map((order, orderIndex) => (
              <tr key={order._id}>
                <td>{orderIndex + 1}</td>
                <td>{order._id}</td>
                <td>{order.receiver_name}</td>
                <td>{order.receiver_address}</td>
                <td>{order.receiver_phone}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    disabled={
                      order.status === "Delivered" ||
                      order.status === "Cancelled"
                    }
                  >
                    {statusOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                        disabled={
                          (order.status === "Pending" &&
                            status !== "In Delivery" &&
                            status !== "Cancelled") ||
                          (order.status === "In Delivery" &&
                            status === "Pending") ||
                          order.status === "Delivered" ||
                          order.status === "Cancelled"
                        }
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    disabled = {order.status === "Cancelled"}
                    value={order.payment_status}
                    onChange={(e) =>
                      handlePaymentStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="unpaid">Chưa thanh toán</option>
                    <option value="paid">Thanh toán</option>
                  </select>
                </td>
                <td>{order.created_at.slice(0, 10)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => openModal(order)}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Chi tiết đơn hàng
          </Typography>
          {selectedOrder ? (
            <>
              <Typography>
                <strong>Người mua:</strong> {selectedOrder.receiver_name}
              </Typography>
              <Typography>
                <strong>Địa chỉ giao hàng:</strong>{" "}
                {selectedOrder.receiver_address}
              </Typography>
              <Typography>
                <strong>Số điện thoại:</strong> {selectedOrder.receiver_phone}
              </Typography>
              <Typography>
                <strong>Ngày đặt hàng:</strong> {selectedOrder.created_at}
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell>Số lượng</TableCell>
                      <TableCell>Màu sắc</TableCell>
                      <TableCell>Dung lượng</TableCell>
                      <TableCell>Ảnh</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item: any, index: number) => (
                      <TableRow key={item._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.product?.title}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>{item.storage}</TableCell>
                        <TableCell>
                          {item.product?.image ? (
                            <img
                              src={`${baseURL}/images/${item.product.image}`}
                              alt={item.product?.title || "Sản phẩm"}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span>Không có ảnh</span>
                          )}
                        </TableCell>
                        <TableCell>{item.price.toLocaleString()} VNĐ</TableCell>
                        <TableCell>
                          {(item.price * item.quantity).toLocaleString()} VNĐ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography>Không có thông tin chi tiết đơn hàng.</Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default QLDH;
