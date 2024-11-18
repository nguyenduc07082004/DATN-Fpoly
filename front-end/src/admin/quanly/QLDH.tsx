import React, { useContext, useEffect, useState } from "react";
import {
  OrderContext,
  OrderContextType,
} from "../../api/contexts/OrdersContext";
import { CartItem } from "../../api/reducers/OrderReducer";
import { baseURL } from "../../api";

const QLDH = () => {
  const { state, fetchOrder, updateOrderStatus } = useContext(
    OrderContext
  ) as OrderContextType;
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (!state || !Array.isArray(state.products)) {
    return <div>Không có đơn hàng nào để hiển thị</div>;
  }

  const statusOptions = ["Pending", "In Delivery", "Delivered", "Cancelled"];

  return (
    <div className="order-management">
      <h2 className="m-3">Quản lý đơn hàng</h2>
      <table className="table table-bordered">
        <thead className="text-center">
          <tr>
            <th>#</th>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>Trạng thái</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {state.products.map((order, orderIndex) => (
            <React.Fragment key={order._id}>
              <tr>
                <td>{orderIndex + 1}</td>
                <td>
                  {order?.products[0]?.product?.title || "Không có tiêu đề"}
                  {order.products.length > 1 &&
                    ` và ${order.products.length - 1} sản phẩm khác`}
                </td>
                <td>{order?.products[0]?.quantity || 0}</td>
                <td>{order.totalPrice || 0}</td>
                <td>
                  <select
                    value={order?.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => toggleExpand(order._id)}
                  >
                    {expandedOrderId === order._id ? "Ẩn" : "Xem"}
                  </button>
                </td>
              </tr>

              {expandedOrderId === order._id && (
                <tr>
                  <td colSpan={6} className="expanded-details">
                    <div className="order-details">
                      <h5>Chi tiết đơn hàng:</h5>
                      <table className="table table-sm table-bordered">
                        <thead>
                          <tr>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Ảnh</th>
                            <th>Loại</th>
                            <th>Màu</th>
                            <th>Dung lượng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products.map((item: CartItem, idx: number) => (
                            <tr key={idx}>
                              <td>{item.product.title}</td>
                              <td>{item.quantity}</td>
                              <td>{item.product.price}</td>
                              <td> <img src={`${baseURL}/images/`+item.product.image} alt="null" width="50px" /></td>
                              <td>
                                {item.product.categories
                                  ? Array.isArray(item.product.categories)
                                    ? item.product.categories
                                        .map((category) => category?.name)
                                        .join(", ")
                                    : item.product.categories?.name
                                  : "Không có danh mục"}
                              </td>
                              <td>{item.product.color}</td>
                              <td>{item.product.storage}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <h5>Thông tin người dùng:</h5>
                      <table className="table table-sm table-bordered">
                        <tbody>
                          <tr>
                            <td>
                              <strong>Tên:</strong>
                            </td>
                            <td>
                              {
                                JSON.parse(localStorage.getItem("user") || "{}")
                                  .fullName
                              }
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Địa chỉ:</strong>
                            </td>
                            <td>
                              {
                                JSON.parse(localStorage.getItem("user") || "{}")
                                  .address
                              }
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Điện thoại:</strong>
                            </td>
                            <td>
                              {
                                JSON.parse(localStorage.getItem("user") || "{}")
                                  .phone
                              }
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Trạng thái thanh toán:</strong>
                            </td>
                            <td>
                              {order.isPaid
                                ? "Đã thanh toán"
                                : "Chưa thanh toán"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLDH;
