import React from 'react';
import './Home.css'; 
import Logo from '../../assets/logoshop.jpg';
import Banner from '../../assets/banner.jpg';

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
        <span>Đăng nhập</span>
        <span>Giỏ hàng</span>
      </div>
    </header>
  );
};

// Component Banner (Phần banner chính)
const MainBanner = () => {
  return (
    <div className="banner">
      <img src={Banner} alt="Banner"/>
    </div>
  );
};

// Component ProductCard (Khung sản phẩm)
interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price} VNĐ</p>
      <button>Mua ngay</button>
    </div>
  );
};

// Component ProductList (Danh sách sản phẩm)
const ProductList = ({ products }: { products: Product[] }) => {
  return (
    <section className="product-list">
      <h2>Sản phẩm nổi bật</h2>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

// Component Deals (Khuyến mãi nổi bật)
const Deals = () => {
  // Dữ liệu mẫu cho sản phẩm (bạn có thể gọi API ở đây)
  const products = [
    { id: 1, name: 'Điện thoại A', price: '5.000.000', image: 'path/to/imageA.jpg' },
    { id: 2, name: 'Điện thoại B', price: '7.000.000', image: 'path/to/imageB.jpg' },
    { id: 3, name: 'Phụ kiện C', price: '500.000', image: 'path/to/imageC.jpg' },
    // Thêm các sản phẩm khác
  ];

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
      <Header />
      <MainBanner />
      <Deals />

    </div>
  );
};

export default Home;
