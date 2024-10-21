import { useState, useEffect } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import "./Home.css";
import "../css/Home.css";


import Logo from "../../assets/logoshop.jpg";


import Banner from "../../assets/banner.jpg";
import { Products } from "../../interfaces/Products";


// Component Header (Thanh điều hướng)
const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={Logo} alt="logo" />
      </div>
      <nav>
        <ul>
          <li>Điện thoại</li>
          <li>Laptop</li>
          <li>Phụ kiện</li>
          <li>Smartwatch</li>
          <li>Đồng hồ</li>
          <li>Máy cũ</li>
          <li>Dịch vụ</li>
        </ul>
      </nav>
      <div className="user-options">
        {/* Sử dụng Link để chuyển đến trang đăng nhập và giỏ hàng */}
        <Link to="/login" className="nav-link">
          Đăng nhập
        </Link>
        <Link to="/cart" className="nav-link">
          Giỏ hàng
        </Link>
      </div>
    </header>
  );
};



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
      <img src={product.imageURL} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{product.price} VNĐ</p>
      <button>
        <Link
          className="text-decoration-none text-white"
          to={`/products/${product.id}`}
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
          <ProductCard key={product.id} product={product} />
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
      .get("http://localhost:3000/products")
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

// Component Footer (Phần chân trang)
const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 Cửa hàng của tôi. Đã đăng ký bản quyền.</p>
    </footer>
  );
};

// Trang chủ chính
const Home = () => {
  return (
    <div>
      <MainBanner />
      <Deals />
      <Footer />
    </div>
  );
};

export default Home;
