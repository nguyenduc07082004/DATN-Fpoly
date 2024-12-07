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
    <div className="order-place">
      <h1 className="my-4 text-center">Danh sách đơn hàng</h1>

      {isLoading && <div className="text-center">Loading...</div>}

      <div className="order-list">
        {orderData.length > 0 ? (
          orderData.map((order : any) => (
            <div key={order._id} className="shadow-sm mb-3 card">
              <div className="card-body">
                <div className="d-flex">
                <h5 className="card-title">Mã đơn hàng: {order._id}</h5>
                <button className="ms-2 fs-6 fw-bold text-uppercase cursor-pointer btn btn-primary" onClick ={() => handleDetail(order._id)}>Chi tiết</button>
                </div>
                <div>
                  {order?.items?.map((item, index) => (
                    <div key={index} className="mb-2">
                      <p>
                        <strong>{item?.product?.title}</strong>
                      </p>
                      <p>
                        <strong>Color:</strong> {item?.color} |{" "}
                        <strong>Storage:</strong> {item?.storage}
                      </p>
                      <p>
                        <strong>Price:</strong> {item?.price.toLocaleString()}{" "}
                        VND
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item?.quantity}
                      </p>
                      <p>
                        <strong>Image:</strong>{" "}
                        <img
                          src={`${baseURL}/images/${item?.product?.image}`}
                          alt="không thấy ảnh"
                          className="me-3"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </p>
                    </div>
                  ))}
                </div>
                <p>
                  <strong>Tổng số lượng:</strong>{" "}
                  {order?.items?.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </p>
                {order?.voucher && (
                  <p>
                    <strong>Mã giảm giá : {order?.voucher}</strong>
                  </p>
                )}
                {order?.discount_value !== 0 && (
                  <p>
                    <strong>
                      Giảm giá : {order?.discount_value?.toLocaleString("vi-VN")}
                      VND
                    </strong>
                  </p>
                )}
                <h2>
                  <strong>Thành tiền:</strong>{" "}
                  {order?.total_price.toLocaleString()} VND
                </h2>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  {order?.status === "Pending" ? (
                    <span className="bg-warning badge">Chờ xác nhận</span>
                  ) : order?.status === "In Delivery" ? (
                    <span className="bg-primary badge">Đang giao</span>
                  ) : order?.status === "Delivered" ? (
                    <span className="bg-success badge">Giao thành công</span>
                  ) : order?.status === "Confirmed" ? (
                    <span className="bg-info badge">Đã xác nhận</span>
                  ) : (
                    <span className="bg-danger badge">Đã huỷ</span>
                  )}
                </p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-warning"
                    onClick={() => handleShowModal(order)}
                    disabled={order?.status !== "Pending"}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteOrder(order._id)}
                    disabled={order?.status !== "Pending"}
                  >
                    Huỷ
                  </button>
                </div>
              </div>
            </div>
          ))
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
              Receiver Name
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
              Receiver Phone
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
              Receiver Address
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
            Huỷ
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
