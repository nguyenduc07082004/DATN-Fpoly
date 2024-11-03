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
      <div className="cart-total">

        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.title} />
              <span>{item.title}</span>
              <span>{item.price.toLocaleString()} VND</span>
              <div className="quantity-control">
                <button className="btn-minus" onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button className="btn-plus" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                  +
                </button>
              </div>
              <span>Tổng: {(item.price * item.quantity).toLocaleString()} VND</span>
              <button onClick={() => removeFromCart(item._id)} className="remove-button">
                Xóa
              </button>
            </div>
          ))}
        </div>
        <div className="order-summary">
        <div className="note">
          <label htmlFor="order-notes">Ghi chú đơn hàng</label>
          <textarea
            id="order-notes"
            name="order-notes"
            rows={4}
            cols={50}
            placeholder="Nhập ghi chú của bạn tại đây..."
          />
        </div>
          <div className="summary-info">
            <table className="summary-table">
                <tr>
                    <td className="label">Tổng tiền hàng</td>
                    <td className="value">21</td>
                    <td className="value">8,820,000</td>
                </tr>
                <tr>
                    <td className="label">Giảm giá</td>
                    <td className="value">0</td>
                    <td className="value">0</td>
                </tr>
            </table>
            <div className="divider"></div>
            <table className="summary-table">
                      <tr>
                    <td className="total-label">Khách cần trả</td>
                    <td className="total-value">8,820,000</td>
                </tr>
            </table>
          </div>
      </div>  
      </div>

      

      {/* Thanh toán */}
      <div className="payment-section">
        {/* Thông tin giao hàng */}
        <div className="info-section">
          <CustomerInfo />
          <ShippingInfo />
        </div>
        <div className="total">
          <span>Tổng tiền hàng</span>
          <span>{subtotal.toLocaleString()} VND</span>
        </div>
        <div className="cod-section">
          <div  className="cod-total">
            <label>Thu hộ tiền (COD)</label>
            <label className="switch-button">
              <input type="checkbox" defaultChecked />
              <span className="slider-switch"></span>
            </label>

          </div>
          <span>{subtotal.toLocaleString()} VND</span>
        </div>
        <button className="payment-button">THANH TOÁN</button>
      </div>
    </div>
  );
};

export default Cart;
