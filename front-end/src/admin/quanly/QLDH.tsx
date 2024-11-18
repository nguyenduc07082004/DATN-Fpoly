import React, { useContext, useEffect, useState } from "react";
import {
  OrderContext,
  OrderContextType,
} from "../../api/contexts/OrdersContext";
import OrderDetails from "../OrderDetails"; // Import OrderDetails

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

              {/* Sử dụng OrderDetails để hiển thị chi tiết đơn hàng */}
              <OrderDetails order={order} expandedOrderId={expandedOrderId} />
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLDH;
