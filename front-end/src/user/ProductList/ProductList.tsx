import React, { useEffect, useState } from 'react';
import './ProductList.css'; // Đảm bảo bạn có tệp CSS cho phong cách
import { Products } from '../../interfaces/Products';


const ProductList = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products'); // Thay đổi URL API cho đúng
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
          <img src={product.imageURL} alt={product.title} />
          <h3>{product.title}</h3>
          <p>{product.price.toLocaleString()} VND</p>
          <button>Thêm vào giỏ hàng</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
