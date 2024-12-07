import { useEffect, useState } from "react";
import ins from "../../api";
import Pagination from "./Pagination"; 
import Swal from "sweetalert2"; // Để hiển thị thông báo SweetAlert
import { Modal } from "react-bootstrap"; // Nếu bạn sử dụng React-Bootstrap

const OrderPlace = () => {
  const userId = JSON.parse(localStorage.getItem("user") ?? "{}")?._id ?? "";
  const [orderData, setOrderData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null); // Dùng để lưu thông tin modal
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [orderId , setOrderId] = useState("")
  const fetchOrderData = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await ins.get("/orders/user/${userId}", {
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

  const handleShowModal = (order : any) => {
    setOrderId(order._id)
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
      const response = await ins.put("/orders/${orderId}", data);
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
    // Hiển thị hộp thoại xác nhận trước khi huỷ đơn hàng
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Bạn có chắc chắn muốn huỷ đơn hàng?',
      text: 'Hành động này không thể hoàn tác.',
      showCancelButton: true,
      confirmButtonText: 'Huỷ đơn',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
  
    if (result.isConfirmed) {
      try {
        const status = "Cancelled";
        const response = await ins.patch("/orders/${orderId}",{ status });
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

  return (
    <div>
      <h1>Đơn hàng</h1>

      {isLoading && <div>Loading...</div>}

      <table className="table table-bordered table-striped">
        <thead className="bg-light text-center">
          <tr>
            <th className="col-1">Mã đơn hàng</th>
            <th className="col-2">Tên sản phẩm</th>
            <th className="col-2">Số lượng</th>
            <th className="col-2">Thành tiền</th>
            <th className="col-1">Thanh toán</th>
            <th className="col-1">Trạng thái</th>
            <th className="col-2">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {orderData.length > 0 ? (
            orderData.map((order, orderIndex) => (
              <tr key={orderIndex}>
                <td>{order._id}</td>
                <td className="text-left">
                  {order?.items?.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <span>{item?.product?.title}</span>
                      <ul className="list-unstyled">
                        <li>
                          <strong>Color:</strong> {item?.color}
                        </li>
                        <li>
                          <strong>Storage:</strong> {item?.storage}
                        </li>
                        <li>
                          <strong>Quantity:</strong> {item?.quantity}
                        </li>
                        <li>
                          <strong>Price:</strong> {item?.price.toLocaleString()}{" "}
                          VND
                        </li>
                      </ul>
                    </div>
                  ))}
                </td>
                <td>
                  {order?.items?.reduce(
                    (total, item) => total + item.quantity,0
                  )}
                </td>
                <td className="fw-bold">
                  {order?.items?.reduce(
                      (total, item) => total + item.price * item.quantity,0
                    )
                    .toLocaleString()}{" "}
                  VND
                </td>
                <td>
                  {order?.payment_status === "paid" ? (
                    <span className="bg-success badge">Đã Thanh toán</span>
                  ) : (
                    <span className="bg-warning badge">Chưa thanh toán</span>
                  )}
                </td>
                <td>
                  {order?.status === "Pending" ? (
                    <span className="bg-info badge">Đang chờ</span>
                  ) : order?.status === "In Delivery" ? (
                    <span className="bg-primary badge">Đang giao</span>
                  ) : order?.status === "Delivered" ? (
                    <span className="bg-success badge">Giao thành công</span>
                  ) : order?.status === "Cancelled" ? (
                    <span className="bg-danger badge">Đã huỷ</span>
                  ) : (
                    order?.status
                  )}
                </td>
                <td>
  <button
    className="btn btn-warning me-2"
    onClick={() => handleShowModal(order)}
    disabled={order?.status !== "Pending" && order?.status !== "Confirmed"} 
  >
    Sửa thông tin
  </button>
  <button
    className="btn btn-danger"
    onClick={() => handleDeleteOrder(order._id)}
    disabled={order?.status !== "Pending" && order?.status !== "Confirmed"}
  >
    Huỷ đơn
  </button>
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                Không tìm thấy đơn hàng
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Use Pagination component */}
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