import React from "react";
import ProductList from "../ProductList/ProductList";
import CustomerInfo from "../page/CustomerInfo";
import ShippingInfo from "../page/ShippingInfo";

const Cart: React.FC = () => {
  return (
    <div className="cart-container">
      {/* Danh sách sản phẩm */}
      <ProductList />

      {/* Thông tin khách hàng và giao hàng */}
      <div className="info-section">
        <CustomerInfo />
        <ShippingInfo />
      </div>

      {/* Thanh toán */}
      <div className="payment-section">
        <div className="total">
          <span>Tổng tiền hàng</span>
          <span>8,820,000 đ</span>
        </div>
        <div className="cod-section">
          <label>Thu hộ tiền (COD)</label>
          <input type="checkbox" defaultChecked />
          <span>8,820,000 đ</span>
        </div>
        <button className="payment-button">THANH TOÁN</button>
      </div>
    </div>
  );
};

export default Cart;
