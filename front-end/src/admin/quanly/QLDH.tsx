import React, { useContext, useEffect, useState } from "react";
import {
  OrderContext,
  OrderContextType,
} from "../../api/contexts/OrdersContext";
import { CartItem } from "../../api/reducers/OrderReducer";

const QLDH = () => {
  const { state, fetchOrder, updateOrderStatus } = useContext(OrderContext) as OrderContextType;
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus); // Cập nhật trạng thái đơn hàng
      fetchOrder(); // Làm mới đơn hàng sau khi cập nhật
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
    <div>
      <p className="m-3">
        <b className="h2">Quản lý đơn hàng</b>
      </p>

      <hr className="tbl" />

      <table className="table">
        <thead className="text-center">
          <tr className="d-flex">
            <th className="col-1">STT</th>
            <th className="col-3">Tên sản phẩm</th>
            <th className="col-2">Số lượng</th>
            <th className="col-2">Thành tiền (VND)</th>
            <th className="col-2">Trạng thái</th>
            <th className="col-2">Chi tiết</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {state.products.map((order, orderIndex) => (
            <React.Fragment key={order._id}>
              {order?.products?.map((item: CartItem, productIndex: number) => (
                <tr className="d-flex" key={item?.product?._id}>
                  {productIndex === 0 && (
                    <td className="col-1" rowSpan={order?.products?.length || 1}>
                      {orderIndex + 1}
                    </td>
                  )}
                  <td className="col-3">{item?.product?.title || "Không có tiêu đề"}</td>
                  <td className="col-2">{item?.quantity || 0}</td>
                  {productIndex === 0 && (
                    <>
                      <td className="col-2" rowSpan={order?.products?.length || 1}>
                        {order?.totalPrice || 0}
                      </td>
                      <td className="col-2" rowSpan={order?.products?.length || 1}>
                        <select
                          value={order?.status}
                          onChange={(e) =>
                            handleStatusChange(order?._id || "", e.target.value)
                          }
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="col-2" rowSpan={order?.products?.length || 1}>
                        <button onClick={() => toggleExpand(order._id)}>
                          {expandedOrderId === order._id ? "Ẩn chi tiết" : "Chi tiết"}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {expandedOrderId === order._id && (
                <tr className="d-flex">
                  <td className="col-12" colSpan={6}>
                    <div className="order-details">
                      <p><strong>Chi tiết đơn hàng:</strong></p>
                      <ul>
                        {order.products.map((item: CartItem, idx: number) => (
                          <li key={idx}>
                            <p>Tên sản phẩm: {item.product.title}</p>
                            <p>Số lượng: {item.quantity}</p>
                            <p>Giá: {item.product.price}</p>
                            <p>Màu sắc: {item.product.color}</p>
                            <p>Bộ nhớ: {item.product.storage}</p>
                          </li>
                        ))}
                      </ul>
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
