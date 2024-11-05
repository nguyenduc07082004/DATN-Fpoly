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
// Import useCart to get cart data

const Header = () => {
  const { logout } = useAuth();
  const { user } = useContext(AuthContext) as AuthContextType;

  // Calculate the total number of items in the cart

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
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
                {JSON.parse(localStorage.getItem("user") || "{}").fullName}
              </strong>
            </Link>
            <ul
              className="shadow text-small dropdown-menu dropdown-menu-dark"
              aria-labelledby="dropdownUser1"
            >
              <li>
                <Link className="dropdown-item" to="#">
                  Tài khoản
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="#">
                  Cài đặt
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
                <Link onClick={() => logout()} className="dropdown-item" to="#">
                  Đăng xuất
                </Link>
              </li>
            </ul>
          </div>
        )}

        <Link to="/cart" className="text-decoration-none cart-icon">
          Giỏ hàng
        </Link>
      </div>
    </header>
  );
};

export default Header;
