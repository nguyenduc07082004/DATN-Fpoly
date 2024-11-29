import { useEffect, useState } from "react";
import ins from "../../api";
import Pagination from "./Pagination"; 

const OrderPlace = () => {
  const userId = JSON.parse(localStorage.getItem("user") ?? "{}")?._id ?? "";
  const [orderData, setOrderData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrderData = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await ins.get(`/orders/${userId}`, {
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

  console.log(orderData,"dasokdo");

  useEffect(() => {
    fetchOrderData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <h1>Đơn hàng</h1>

      {isLoading && <div>Loading...</div>}

      <table className="table table-bordered table-striped">
        <thead className="text-center bg-light">
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
                    (total, item) => total + item.quantity,
                    0
                  )}
                </td>
                <td className="fw-bold">
                  {order?.items?.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toLocaleString()}{" "}
                  VND
                </td>
                <td>
                  {order?.payment_status === "paid" ? (
                    <span className="badge bg-success">Đã Thanh toán</span>
                  ) : (
                    <span className="badge bg-warning">Chưa thanh toán</span>
                  )}
                </td>
                <td>
                  {order?.status === "Pending" ? (
                    <span className="badge bg-info">Đang chờ</span>
                  ) : order?.status === "In Delivery" ? (
                    <span className="badge bg-primary">Đang giao</span>
                  ) : order?.status === "Delivered" ? (
                    <span className="badge bg-success">Giao thành công</span>
                  ) : order?.status === "Cancelled" ? (
                    <span className="badge bg-danger">Đã huỷ</span>
                  ) : (
                    order?.status
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleShowModal(order?.description)}
                  >
                    Sửa thông tin
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleShowModal(order?.description)}
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
    </div>
  );
};

export default OrderPlace;
