// src/ProductList/ProductList.tsx
import React, { useEffect, useState } from "react";
import "../css/ProductList.css";
import { Products } from "../../interfaces/Products";
import { useCart } from "../Cart/CartContext"; // Nhập useCart

const ProductList = () => {
  const { addToCart } = useCart(); // Lấy hàm addToCart từ context
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product._id} className="product-item">
          <img src={product.image} alt={product.title} />
          <h3>{product.title}</h3>
          <p>{product.price.toLocaleString()} VND</p>
          <button onClick={() => addToCart(product)}>Thêm vào giỏ hàng</button> {/* Gọi addToCart */}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
