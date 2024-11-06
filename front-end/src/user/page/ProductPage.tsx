import React, { useContext, useEffect, useState } from "react";
import { CartContext, CartContextType } from "../../api/contexts/CartContext";
import "../css/Style.css";

const ProductPage = () => {
  const { state } = useContext(CartContext) as CartContextType;
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Nếu đã có đơn hàng trong context, lưu vào state local
    if (state.order) {
      setOrderDetails(state.order);
    }
  }, [state.order]);

  return (
    <div className="container">
      <div className="product-section">
        <h1>Thông tin đơn hàng của bạn</h1>

        {orderDetails ? (
          <div>
            <h2>Mã đơn hàng: {orderDetails.orderId}</h2>
            <h3>Tổng tiền: {orderDetails.totalPrice} VND</h3>
            <ul>
              {orderDetails.items.map((item: any, index: number) => (
                <li key={index}>
                  {item.product?.title} - Số lượng: {item.quantity} - Giá:{" "}
                  {item.product?.price} VND
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Chưa có đơn hàng nào được đặt.</p>
        )}
      </div>

      <footer className="footer">
        <p>© 2024 - Website bán điện thoại và phụ kiện</p>
      </footer>
    </div>
  );
};

export default ProductPage;
