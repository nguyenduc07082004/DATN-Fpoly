// src/Cart/Cart.tsx
import React from 'react';
import { useCart } from './CartContext';
import '../css/Cart.css';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  if (cartItems.length === 0) {
    return <div>Giỏ hàng trống.</div>; // Hiển thị khi giỏ hàng trống
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Giỏ hàng</h2>
      {cartItems.map(item => (
        <div key={item._id} className="cart-item">
          <img src={item.image} alt={item.title} />
          <h4>{item.title}</h4>
          <p>Giá: {item.price.toLocaleString()} VND</p>
          <div>
            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
            <button onClick={() => removeFromCart(item._id)}>Xóa</button>
          </div>
        </div>
      ))}
      <div>
        <h3>Tổng cộng: {subtotal.toLocaleString()} VND</h3>
      </div>
    </div>
  );
};

export default Cart;
