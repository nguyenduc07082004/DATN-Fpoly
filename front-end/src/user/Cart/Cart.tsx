import React, { useState, useEffect } from 'react';
import '../css/Cart.css';
// import iphone13 from '.././img/iphone13.jpg';
// import galaxyS21 from '.././img/galaxyS21.jpg';
// import charger from '.././img/charger.jpg';
// import airpods from '.././img/airpods.jpg';
import { CartItem } from '../../interfaces/Products'; // Nhập interface của bạn

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Lấy dữ liệu giỏ hàng từ API
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch("http://localhost:8000/carts/1"); // Thay đổi ID theo người dùng
                if (!response.ok) {
                    throw new Error("Failed to fetch cart items");
                }
                const data = await response.json();
                setCartItems(data.items); // Giả định API trả về mảng items trong cart
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleQuantityChange = (id: number, delta: number) => {
        setCartItems(prevItems => 
            prevItems.map(item => 
                item._id === id ? { ...item, quantity: item.quantity + delta } : item
            )
        );
    };

    const handleRemoveItem = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="cart-container" style={{ padding: '20px' }}>
            <h2>Giỏ hàng</h2>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item._id} className="cart-item" style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <img src={item.image} alt={item.title} style={{ width: '100px', height: '100px', marginRight: '20px' }} />
                        <div style={{ flexGrow: 1 }}>
                            <h4>{item.title}</h4>
                            <p>Price: {item.price.toLocaleString()} VND <span style={{ textDecoration: 'line-through', color: '#999' }}>{item.price.toLocaleString()} VND</span></p>
                            <p>You Save: {(item.price - item.price).toLocaleString()} VND</p>
                            <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button onClick={() => handleQuantityChange(item._id, -1)} disabled={item.quantity <= 1}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                            <p>Total: {(item.price * item.quantity).toLocaleString()} VND</p>
                            <button onClick={() => handleRemoveItem(item._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
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
