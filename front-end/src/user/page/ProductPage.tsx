import React from 'react';
// import '../css/ProductPage.css';  Đảm bảo bạn có CSS trong file này hoặc có thể dùng styled-components
import "../css/Style.css";
 

const ProductPage = () => {
  return (
    <div className="container">
      <div className="product-section">
        {/* Nội dung sản phẩm */}
        <h1>Trang sản phẩm</h1>
        {/* Các phần sản phẩm */}
      </div>

      <footer className="footer">
        <p>© 2024 - Website bán điện thoại và phụ kiện</p>
      </footer>
    </div>
  );
}

export default ProductPage;
