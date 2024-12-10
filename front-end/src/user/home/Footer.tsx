import React from "react";

import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#000044",
        color: "white",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {/* Company Section */}
        <div style={{ flex: "1", minWidth: "250px", marginBottom: "20px" }}>
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            SMARTSHOP - CỬA HÀNG ĐIỆN THOẠI
          </h6>
          <p>
            Chúng tôi cung cấp các dòng sản phẩm điện thoại thông minh và phụ
            kiện chính hãng với giá tốt nhất thị trường.
          </p>
          <p>
            Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh
          </p>
        </div>

        {/* Customer Support Section */}
        <div style={{ flex: "1", minWidth: "200px", marginBottom: "20px" }}>
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Hỗ Trợ Khách Hàng
          </h6>
          <p>
            <a href="#!" style={{ color: "white", textDecoration: "none" }}>
              Chính sách bảo hành
            </a>
          </p>
          <p>
            <a href="#!" style={{ color: "white", textDecoration: "none" }}>
              Chính sách đổi trả
            </a>
          </p>
          <p>
            <a href="#!" style={{ color: "white", textDecoration: "none" }}>
              Hướng dẫn mua hàng
            </a>
          </p>
          <p>
            <a href="#!" style={{ color: "white", textDecoration: "none" }}>
              Liên hệ hỗ trợ
            </a>
          </p>
        </div>

        {/* Contact Section */}
        <div style={{ flex: "1", minWidth: "200px", marginBottom: "20px" }}>
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Liên Hệ
          </h6>
          <p>
            <i className="fas fa-map-marker-alt" style={{ marginRight: "10px" }}></i>
            123 Đường ABC, TP. Hồ Chí Minh
          </p>
          <p>
            <i className="fas fa-envelope" style={{ marginRight: "10px" }}></i>
            support@smartshop.vn
          </p>
          <p>
            <i className="fas fa-phone" style={{ marginRight: "10px" }}></i>
            1900 123 456
          </p>
        </div>

        {/* Follow Us Section */}
        <div style={{ flex: "1", minWidth: "200px", marginBottom: "20px" }}>
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Theo Dõi Chúng Tôi
          </h6>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            {/* Facebook */}
            <a
              href="#!"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#3b5998",
                color: "white",
                textDecoration: "none",
                fontSize: "18px",
              }}
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            {/* Twitter */}
            <a
              href="#!"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#55acee",
                color: "white",
                textDecoration: "none",
                fontSize: "18px",
              }}
            >
              <i className="fab fa-twitter"></i>
            </a>
            {/* Google */}
            <a
              href="#!"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#dd4b39",
                color: "white",
                textDecoration: "none",
                fontSize: "18px",
              }}
            >
              <i className="fab fa-google"></i>
            </a>
            {/* Instagram */}
            <a
              href="#!"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#ac2bac",
                color: "white",
                textDecoration: "none",
                fontSize: "18px",
              }}
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div
        style={{
          marginTop: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          padding: "10px 0",
          fontSize: "14px",
        }}
      >
        &copy; 2024 SmartShop - All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
