import { Link } from "react-router-dom"; // Import Link for navigation
import Logo from "../../assets/logoshop.jpg";
import "../css/Home.css";
import {
  AuthContext,
  AuthContextType,
  useAuth,
} from "../../api/contexts/AuthContext";
import { useContext } from "react";

const Header = () => {
  const { logout } = useAuth();
  const { user } = useContext(AuthContext) as AuthContextType;
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
        {!localStorage.getItem("token") ? (
          <>
            <Link to="/login" className="text-decoration-none">
              <span>Đăng nhập</span>
            </Link>
            {/* Wrap Đăng kí in a Link component */}
            <Link to="/register" className="text-decoration-none">
              <span style={{ margin: "0 10px" }}>Đăng kí</span>
            </Link>
          </>
        ) : (
          <div className="dropdown">
            <Link
              to="#"
              className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://t4.ftcdn.net/jpg/02/74/20/69/360_F_274206901_Jt1PHZTbtwne17anw5eD9oABxStNJhYT.jpg"
                alt=""
                width="32"
                height="32"
                className="rounded-circle me-2"
              />
              <strong>
                {JSON.parse(localStorage.getItem("user") || "{}").fullName}
              </strong>
            </Link>
            <ul
              className="dropdown-menu dropdown-menu-dark text-small shadow"
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

        <span>Giỏ hàng</span>
      </div>
    </header>
  );
};

export default Header;
