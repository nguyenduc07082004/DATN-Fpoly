import React, { useEffect, useState } from "react";
import "../css/Style.css";
import { Products } from "../../interfaces/Products";
// Import the updated path for useCart

const ProductList = () => {
  // Retrieve addToCart from CartContext
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("all");

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

  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.categories === category);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-list">
      {/* Category filter buttons */}
      <div className="category-filter">
        <button
          className={category === "all" ? "active" : ""}
          onClick={() => setCategory("all")}
        >
          Tất cả
        </button>
        <button
          className={category === "phone" ? "active" : ""}
          onClick={() => setCategory("phone")}
        >
          Điện thoại
        </button>
        <button
          className={category === "accessory" ? "active" : ""}
          onClick={() => setCategory("accessory")}
        >
          Phụ kiện
        </button>
      </div>

      {/* Product list */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-item">
            <img
              src={product.image}
              alt={product.title}
              className="product-image"
            />
            <h3 className="product-title">{product.title}</h3>
            <p className="product-price">
              {product.price.toLocaleString()} VND
            </p>
            <button className="add-to-cart-button">Thêm vào giỏ hàng</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
