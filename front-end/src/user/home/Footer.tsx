import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#929fba",
        color: "white",
        padding: "20px 0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Company Section */}
        <div style={{ flex: "1", margin: "0 20px", minWidth: "200px" }}>
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Smart shop
          </h6>
          <p>
            Here you can use rows and columns to organize your footer content.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
        </div>

        {/* Products Section */}
        <div style={{ flex: "1", margin: "0 20px", minWidth: "200px" }}>
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Hỗ trợ khách hàng
          </h6>
          <p>
            <a href="#!" style={{ color: "white", textDecoration: "none" }}>
              Điện thoại
            </a>
          </p>
          <p>
            <a href="#!" style={{ color: "white", textDecoration: "none" }}>
              Phụ kiện điện thoại
            </a>
          </p>
          <p>
            <a href="#!" style={{ color: "white", textDecoration: "none" }}>
              BrandFlow
            </a>
          </p>
          <p>
            <a href="#!" style={{ color: "white", textDecoration: "none" }}>
              Bootstrap Angular
            </a>
          </p>
        </div>

        {/* Contact Section */}
        <div style={{ flex: "1", margin: "0 20px", minWidth: "200px" }}>
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Contact
          </h6>
          <p style={{ margin: "5px 0" }}>
            <i className="fas fa-home" style={{ marginRight: "10px" }}></i>
            New York, NY 10012, US
          </p>
          <p style={{ margin: "5px 0" }}>
            <i className="fas fa-envelope" style={{ marginRight: "10px" }}></i>
            info@gmail.com
          </p>
          <p style={{ margin: "5px 0" }}>
            <i className="fas fa-phone" style={{ marginRight: "10px" }}></i>+ 01
            234 567 88
          </p>
          <p style={{ margin: "5px 0" }}>
            <i className="fas fa-print" style={{ marginRight: "10px" }}></i>+ 01
            234 567 89
          </p>
        </div>

        {/* Follow Us Section */}
        <div style={{ flex: "1", margin: "0 20px", minWidth: "200px" }}>
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Follow us
          </h6>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <a
              href="#!"
              style={{
                padding: "10px",
                borderRadius: "50%",
                backgroundColor: "#3b5998",
                color: "white",
                textDecoration: "none",
              }}
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#!"
              style={{
                padding: "10px",
                borderRadius: "50%",
                backgroundColor: "#55acee",
                color: "white",
                textDecoration: "none",
              }}
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#!"
              style={{
                padding: "10px",
                borderRadius: "50%",
                backgroundColor: "#dd4b39",
                color: "white",
                textDecoration: "none",
              }}
            >
              <i className="fab fa-google"></i>
            </a>
            <a
              href="#!"
              style={{
                padding: "10px",
                borderRadius: "50%",
                backgroundColor: "#ac2bac",
                color: "white",
                textDecoration: "none",
              }}
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          marginTop: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          padding: "10px",
        }}
      ></div>
    </footer>
  );
};

export default Footer;
