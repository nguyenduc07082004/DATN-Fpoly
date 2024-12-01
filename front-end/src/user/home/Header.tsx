import { Link } from "react-router-dom";
import Logo from "../../../logo.png";
import "../css/Style.css";
import {
  AuthContext,
  AuthContextType,
  useAuth,
} from "../../api/contexts/AuthContext";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { CartContext, CartContextType } from "../../api/contexts/CartContext";
import ins from "../../api";
import { baseURL } from "../../api";

const Header = () => {
  const { logout } = useAuth();
  const { user } = useContext(AuthContext) as AuthContextType;
  const { state } = useContext(CartContext) as CartContextType;
  
  // Tính toán số lượng sản phẩm trong giỏ hàng
  const totalProduct = state.products.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleLogout = async () => {
    try {
      const response = await ins.post(`${baseURL}/logout`); 
      if (response.status === 200) {
        logout(); 
        localStorage.removeItem("accessToken"); 
        localStorage.removeItem("user"); 
        alert("Đăng xuất thành công!"); 
      }
    } catch (error : any) {
      if (error.response) {
        console.error("Lỗi:", error.response.data.message);
        alert(error.response.data.message || "Đã xảy ra lỗi khi đăng xuất.");
      } else {
        console.error("Lỗi không xác định:", error.message);
        alert("Không thể kết nối đến server. Vui lòng thử lại.");
      }
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link
              to="/"
              className="text-decoration-none"
              style={{ color: "white" }}
            >
              Trang chủ
            </Link>
          </li>
          <li>
            <Link
              to="/other"
              className="text-decoration-none"
              style={{ color: "white" }}
            >
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-decoration-none"
              style={{ color: "white" }}
            >
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-decoration-none"
              style={{ color: "white" }}
            >
              Liên hệ
            </Link>
          </li>
          <li>
            <Link
              to="/orderplace"
              className="text-decoration-none"
              style={{ color: "white" }}
            >
              Đơn hàng
            </Link>
          </li>
          <li className="dropdown">
            <Link
              to="#"
              className="text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ color: "white" }}
            >
              Thiết bị
            </Link>
            <ul className="dropdown-menu">
              <li>
                <Link to="/products/phone" className="dropdown-item">
                  Điện thoại
                </Link>
              </li>
              <li>
                <Link to="/products/laptop" className="dropdown-item">
                  Laptop
                </Link>
              </li>
              <li>
                <Link to="/products/accessory" className="dropdown-item">
                  Phụ kiện
                </Link>
              </li>
              <li>
                <Link to="/products/smartwatch" className="dropdown-item">
                  Smartwatch
                </Link>
              </li>
              <li>
                <Link to="/products/watch" className="dropdown-item">
                  Đồng hồ
                </Link>
              </li>
              <li>
                <Link to="/products/used" className="dropdown-item">
                  Máy cũ
                </Link>
              </li>
              <li>
                <Link to="/services" className="dropdown-item">
                  Dịch vụ
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className="user-options">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="search-bar"
        />
        {!localStorage.getItem("accessToken") ? (
          <>
            <Link to="/login" className="text-decoration-none">
              <span>Đăng nhập</span>
            </Link>
            <Link to="/register" className="text-decoration-none">
              <span style={{ margin: "0 10px" }}>Đăng kí</span>
            </Link>
          </>
        ) : (
          <div className="dropdown">
            <Link
              to="#"
              className="text-white text-decoration-none d-flex align-items-center dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <strong>
                {JSON.parse(localStorage.getItem("user") || "{}").first_name}
              </strong>
            </Link>
            <ul
              className="shadow text-small dropdown-menu dropdown-menu-dark"
              aria-labelledby="dropdownUser1"
            >
              <li>
                <Link className="dropdown-item" to="/profile">
                  Tài khoản
                </Link>
              </li>
              {user?.role === "admin" && (
                <li>
                  <Link className="dropdown-item" to="/admin">
                    Trang quản trị
                  </Link>
                </li>
              )}
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link onClick={() => handleLogout()} className="dropdown-item" to="#">
                  Đăng xuất
                </Link>
              </li>
            </ul>
          </div>
        )}
     <Link to="/cart" className="text-decoration-none cart-icon">
  <FontAwesomeIcon icon={faCartShopping} />
  {totalProduct > 0 && (
    <span className="cart-item-count">{totalProduct}</span>
  )}
</Link>
      </div>
    </header>
  );
};

export default Header;
