import { useEffect, useState } from "react";
import "../css/Style.css";
import { Products } from "../../interfaces/Products";

const ProductPage = () => {
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
    <div className="container">
      <div className="product-section">
        <h1>Tất cả sản phẩm</h1>

        <div className="products-grid">
          {products.map((product) => (
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

      <footer className="footer">
        <p>© 2024 - Website bán điện thoại và phụ kiện</p>
      </footer>
    </div>
  );
};

export default ProductPage;
