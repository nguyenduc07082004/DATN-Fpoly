import React from "react";
import { CartItem } from "../api/reducers/OrderReducer";
import { baseURL } from "../api";

interface OrderDetailsProps {
  order: any; // Thay 'any' bằng interface cụ thể của order nếu có
  expandedOrderId: string | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, expandedOrderId }) => {
  return (
    expandedOrderId === order._id && (
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
                    <td>
                      <img
                        src={`${baseURL}/images/` + item.product.image}
                        alt="null"
                        width="50px"
                      />
                    </td>
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
                    {JSON.parse(localStorage.getItem("user") || "{}").fullName}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Địa chỉ:</strong>
                  </td>
                  <td>
                    {JSON.parse(localStorage.getItem("user") || "{}").address}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Điện thoại:</strong>
                  </td>
                  <td>
                    {JSON.parse(localStorage.getItem("user") || "{}").phone}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Trạng thái thanh toán:</strong>
                  </td>
                  <td>{order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    )
  );
};

export default OrderDetails;
