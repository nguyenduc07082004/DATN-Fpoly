// src/Cart/Cart.tsx
import React from "react";
import { useCart } from "./CartContext";
import CustomerInfo from "../page/CustomerInfo";
import ShippingInfo from "../page/ShippingInfo";
import "../css/Style.css";

const Cart: React.FC = () => {
  const { cartItems, user, updateQuantity, removeFromCart } = useCart(); // Access functions from context

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      {/* Display user information */}
      {user && (
        <div className="user-info">
          <h3>Thông tin khách hàng</h3>
          <p>Họ và tên: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      )}

      {/* Display only items added to the cart */}
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.price.toLocaleString()} VND</p>
            <div className="quantity-control">
              <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                +
              </button>
            </div>
            <p>Tổng: {(item.price * item.quantity).toLocaleString()} VND</p>
            <button onClick={() => removeFromCart(item._id)} className="remove-button">
              Xóa
            </button>
          </div>
        ))}
      </div>

      {/* Thông tin giao hàng */}
      <div className="info-section">
        <CustomerInfo />
        <ShippingInfo />
      </div>

      {/* Thanh toán */}
      <div className="payment-section">
        <div className="total">
          <span>Tổng tiền hàng</span>
          <span>{subtotal.toLocaleString()} VND</span>
        </div>
        <div className="cod-section">
          <label>Thu hộ tiền (COD)</label>
          <input type="checkbox" defaultChecked />
          <span>{subtotal.toLocaleString()} VND</span>
        </div>
        <button className="payment-button">THANH TOÁN</button>
      </div>
    </div>
  );
};

export default Cart;
