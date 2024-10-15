import React, { useEffect, useState } from 'react';
import './ProductList.css'; // Đảm bảo bạn có tệp CSS cho phong cách

// Định nghĩa kiểu cho sản phẩm
interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  // Thêm các thuộc tính khác nếu cần
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.example.com/products'); // Thay đổi URL API cho đúng
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data); // Giả định API trả về mảng sản phẩm
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Chỉ gọi một lần khi component được mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <img src={product.imageUrl} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price.toLocaleString()} VND</p>
          <button>Thêm vào giỏ hàng</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
