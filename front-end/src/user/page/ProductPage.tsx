import { useEffect, useState } from "react";
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
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Tất cả sản phẩm</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                transition: "transform 0.3s",
              }}
            >
              <img
                src={ product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "150px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
              <h3 style={{ fontSize: "18px", marginBottom: "5px", fontWeight: "600" }}>
                {product.title}
              </h3>
              <p style={{ fontSize: "16px", color: "#ff6600", marginBottom: "10px" }}>
                {product.price.toLocaleString()} VND
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ff6600",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "#e65c00";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "#ff6600";
                }}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#888" }}>
        <p>© 2024 - Website bán điện thoại và phụ kiện</p>
      </footer>
    </div>
  );
};

export default ProductPage;
