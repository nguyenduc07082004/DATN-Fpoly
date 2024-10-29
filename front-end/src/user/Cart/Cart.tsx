import React, { useState } from 'react';
import '../css/Cart.css';
import iphone13 from '.././img/iphone13.jpg';
import galaxyS21 from '.././img/galaxyS21.jpg';
import charger from '.././img/charger.jpg';
import airpods from '.././img/airpods.jpg';
interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    quantity: number;
    image: string;
}

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<Product[]>([
        { id: 1, name: 'iPhone 13', price: 999.00, originalPrice: 1099.00, quantity: 1, image: iphone13 },
        { id: 2, name: 'Samsung Galaxy S21', price: 799.00, originalPrice: 899.00, quantity: 1, image: galaxyS21 },
        { id: 3, name: 'Wireless Charger', price: 49.99, originalPrice: 59.99, quantity: 2, image: charger },
        { id: 4, name: 'AirPods Pro', price: 249.00, originalPrice: 299.00, quantity: 1, image: airpods },
    ]);

    const handleQuantityChange = (id: number, delta: number) => {
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === id ? { ...item, quantity: item.quantity + delta } : item
            )
        );
    };

    const handleRemoveItem = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="cart-container" style={{ padding: '20px' }}>
            <h2>Giỏ hàng</h2>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item" style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', marginRight: '20px' }} />
                        <div style={{ flexGrow: 1 }}>
                            <h4>{item.name}</h4>
                            <p>Price: {item.price.toLocaleString()} VND <span style={{ textDecoration: 'line-through', color: '#999' }}>{item.originalPrice.toLocaleString()} VND</span></p>
                            <p>You Save: {(item.originalPrice - item.price).toLocaleString()} VND</p>
                            <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button onClick={() => handleQuantityChange(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                            <p>Total: {(item.price * item.quantity).toLocaleString()} VND</p>
                            <button onClick={() => handleRemoveItem(item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary" style={{ marginTop: '20px', textAlign: 'right' }}>
                <p>Subtotal: {subtotal.toLocaleString()} VND</p>
                <p>Shipping: 6.90 USD</p>
                <h3>Total: {(subtotal + 6.90).toLocaleString()} USD</h3>
                <button style={{ padding: '10px 20px', backgroundColor: '#ff4d4f', color: '#fff', border: 'none', cursor: 'pointer' }}>Proceed To Checkout</button>
            </div>
        </div>
    );
};

export default Cart;
