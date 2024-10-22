import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Logo from "../../assets/logoshop.jpg";
import "../css/Home.css";

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
        {/* Search bar */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="search-bar"
        />
        <Link to="/login" className="text-decoration-none">
          <span>Đăng nhập</span>
        </Link>
        {/* Wrap Đăng kí in a Link component */}
        <Link to="/register" className="text-decoration-none">
          <span style={{ margin: "0 10px" }}>Đăng kí</span>
        </Link>
        <span>Giỏ hàng</span>
      </div>
    </header>
  );
};

export default Header;
