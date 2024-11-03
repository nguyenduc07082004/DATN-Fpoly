import { useState, useEffect } from "react";
import axios from "axios";
// import "../css/Home.css";
import "../css/Style.css";

import Banner from "../../assets/banner.jpg";
import { Products } from "../../interfaces/Products";
import { Link } from "react-router-dom";

// Component Banner (Phần banner chính)
const MainBanner = () => {
  return (
    <div className="banner">
      <img src={Banner} alt="Banner" />
    </div>
  );
};

// Component ProductCard (Khung sản phẩm)
const ProductCard = ({ product }: { product: Products }) => {
  return (
    <div className="product-card">
      <div>
        <img src={product._id} alt={product.title} />
      </div>
      <h3>{product.title}</h3>
      <p>{product.price} VNĐ</p>
      <button>
        <Link
          className="text-decoration-none text-white"
          to={`/products/${product._id}`}
        >
          Mua ngay
        </Link>
      </button>
    </div>
  );
};

// Component ProductList (Danh sách sản phẩm)
const ProductList = ({ products }: { products: Products[] }) => {
  return (
    <section className="product-list">
      <h2>Sản phẩm nổi bật</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

// Component Deals (Khuyến mãi nổi bật)
const Deals = () => {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu sản phẩm: ", error);
      });
  }, []);

  return (
    <section className="deals">
      <h2>Khuyến mãi Online</h2>
      <ProductList products={products} />
    </section>
  );
};

// Trang chủ chính
const Home = () => {
  return (
    <div>
      <MainBanner />
      <Deals />
    </div>
  );
};

export default Home;
