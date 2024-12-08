import { useEffect, useState } from "react";
import ins from "../../api";
import Pagination from "./Pagination";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { baseURL } from "../../api";
import { useNavigate } from "react-router-dom";

const OrderPlace = () => {
  const userId = JSON.parse(localStorage.getItem("user") ?? "{}")?._id ?? "";
  const [orderData, setOrderData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  const fetchOrderData = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await ins.get(`/orders/user/${userId}`, {
        params: { page, limit: 5 },
      });
      setOrderData(res.data.orders);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching order data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleShowModal = (order: any) => {
    setOrderId(order._id);
    setReceiverAddress(order.receiver_address);
    setReceiverPhone(order.receiver_phone);
    setReceiverName(order.receiver_name);
    setShowModal(true);
  };

  const handleSave = async () => {
    const data = {
      receiver_address: receiverAddress,
      receiver_phone: receiverPhone,
      receiver_name: receiverName,
    };
    try {
      const response = await ins.put(`/orders/${orderId}`, data);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thay đổi thông tin đơn hàng thành công",
        });
        fetchOrderData(currentPage);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteOrder = async (orderId: string) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Bạn có chắc chắn muốn huỷ đơn hàng?",
      text: "Hành động này không thể hoàn tác.",
      showCancelButton: true,
      confirmButtonText: "Huỷ đơn",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        const status = "Cancelled";
        const response = await ins.patch(`/orders/${orderId}`, { status });
        if (response.status === 200) {
          fetchOrderData(currentPage);
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Xóa đơn hàng thành công",
          });
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi huỷ đơn hàng.",
        });
      }
    }
  };

  const handleDetail = (id: string) => {
    navigate(`/orderplace/${id}`);
  };

  return (
    <div className="container-xl bg-white rounded shadow-sm p-4">
      <h1 className="my-4 text-center">Danh sách đơn hàng</h1>

      {isLoading && <div className="text-center">Loading...</div>}

      <div className="order-list">
        {orderData.length > 0 ? (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Mã đơn hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng số lượng</th>
                <th>Trạng thái</th>
                <th>Thành tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orderData.map((order: any, index: number) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order._id}</td>
                  <td>
                    {order?.items?.map((item: any, idx: number) => (
                      <div key={idx}>
                        <strong>{item.product.title}</strong> (x
                        {item.quantity})
                      </div>
                    ))}
                  </td>
                  <td>
                    {order.items.reduce(
                      (total: number, item: any) => total + item.quantity,
                      0
                    )}
                  </td>
                  <td>
                    {order.status === "Pending" ? (
                      <span className="bg-warning badge">Chờ xác nhận</span>
                    ) : order.status === "In Delivery" ? (
                      <span className="bg-primary badge">Đang giao</span>
                    ) : order.status === "Delivered" ? (
                      <span className="bg-success badge">Giao thành công</span>
                    ) : order.status === "Confirmed" ? (
                      <span className="bg-info badge">Đã xác nhận</span>
                    ) : (
                      <span className="bg-danger badge">Đã huỷ</span>
                    )}
                  </td>
                  <td>{order.total_price.toLocaleString()} VND</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleDetail(order._id)}
                    >
                      Chi tiết
                    </button>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleShowModal(order)}
                      disabled={order.status !== "Pending"}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteOrder(order._id)}
                      disabled={order.status !== "Pending"}
                    >
                      Huỷ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">Không tìm thấy đơn hàng</div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin giao hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="receiver_name" className="form-label">
              Tên người nhận
            </label>
            <input
              type="text"
              id="receiver_name"
              className="form-control"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="receiver_phone" className="form-label">
              Số điện thoại
            </label>
            <input
              type="text"
              id="receiver_phone"
              className="form-control"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="receiver_address" className="form-label">
              Địa chỉ
            </label>
            <input
              type="text"
              id="receiver_address"
              className="form-control"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Đóng
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Lưu
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderPlace;
