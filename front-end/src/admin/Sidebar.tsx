import { useContext, useEffect } from "react";
import { OrderContext, OrderContextType } from "../api/contexts/OrdersContext";
import { Link } from "react-router-dom";
import ".././App.scss";
import { useAuth } from "../api/contexts/AuthContext";
import { io } from "socket.io-client";
import { baseURL } from "../api";
import toastr from "toastr";
const AdminSidebar = () => {
  const { logout } = useAuth();
  const { fetchOrder } = useContext(OrderContext) as OrderContextType;
  const socket = io(baseURL);
  let hasShownMessage = JSON.parse(
    localStorage.getItem("hasShownMessage") || "{}"
  );
  // Khi nhận sự kiện

  useEffect(() => {
    socket.on("orderCreated", (data) => {
      toastr.success(data.message, "Thành công", {
        onclick: () => {
          window.location.href = "/admin/qldh";
        },
      });
      // Cập nhật trạng thái đã hiển thị thông báo
      hasShownMessage[data.orderId] = true;
      localStorage.setItem("hasShownMessage", JSON.stringify(hasShownMessage));

      fetchOrder();
    });
    return () => {
      socket.off("orderCreated");
    };
  }, [fetchOrder, socket]);
  return (
    <div className="position-fixed">
      <div
        className="bg-dark flex-column flex-shrink-0 text-white p-3 d-flex"
        style={{ height: "100vh", width: "280px" }}
      >
        <Link
          to="/admin"
          className="text-white text-decoration-none mb-3 mb-md-0 d-flex align-items-center me-md-auto"
        >
          <img
            className="bi me-2"
            width="35"
            height="32"
            src="https://i.ibb.co/s3PxFtq/logo.png"
            alt=""
          />

          <span className="fs-4">SmartShop</span>
        </Link>
        <hr />
        <ul className="flex-column mb-auto nav nav-pills">
          <li className="nav-item">
            <Link to="/admin" className="text-white nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-house-door me-2"
                viewBox="0 0 16 16"
              >
                <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
              </svg>
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/admin/qldm" className="text-white nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-hdd-stack me-2"
                viewBox="0 0 16 16"
              >
                <path d="M14 10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1zM2 9a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2z" />
                <path d="M5 11.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-2 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M14 3a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                <path d="M5 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-2 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
              </svg>
              Quản lý danh mục
            </Link>
          </li>
          <li>
            <Link to="/admin/qlsp" className="text-white nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-box2 me-2"
                viewBox="0 0 16 16"
              >
                <path d="M2.95.4a1 1 0 0 1 .8-.4h8.5a1 1 0 0 1 .8.4l2.85 3.8a.5.5 0 0 1 .1.3V15a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4.5a.5.5 0 0 1 .1-.3zM7.5 1H3.75L1.5 4h6zm1 0v3h6l-2.25-3zM15 5H1v10h14z" />
              </svg>
              Quản lý sản phẩm
            </Link>
          </li>
          <li>
            <Link to="/admin/qldh" className="text-white nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-truck me-2"
                viewBox="0 0 16 16"
              >
                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
              </svg>
              Quản lý đơn hàng
            </Link>
          </li>
          <li>
            <Link to="/admin/qlhd" className="text-white nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-clipboard-check me-2"
                viewBox="0 0 16 16"
              >
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1- .708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V1.5a.5.5 0 0 0-.5-.5h-1z" />
              </svg>
              Quản lý hoá đơn
            </Link>
          </li>
          <li>
            <Link to="/admin/qltk" className="text-white nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-person me-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
              </svg>
              Quản lý tài khoản
            </Link>
          </li>
          <li>
            <Link to="/admin/qlbl" className="text-white nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-chat me-2"
                viewBox="0 0 16 16"
              >
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
              </svg>
              Quản lý đánh giá
            </Link>
          </li>       
          <li>
            <Link to="/admin/qlvc" className="text-white nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-cash-stack me-2"
                viewBox="0 0 16 16"
              >
                <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a1 1 0 0 1-1 1H1v-1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1zm-7-2a1 1 0 0 0-1 1v1h14v-1a1 1 0 0 0-1-1H1z" />
                <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
              </svg>
              Quản lý vouchers
            </Link>
          </li>
          <li>
            <Link to="/admin/trash" className="text-white nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash me-2"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path
                  fillRule="evenodd"
                />
                </svg>
              Thùng rác
            </Link>
          </li>
          <li>
            <Link to="/" className="text-white nav-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-return-left me-2"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"
                />
              </svg>
              Quay lại trang người dùng{" "}
            </Link>
          </li>
        </ul>
        <hr />
        <div className="dropdown">
          <Link
            to="#"
            className="text-white text-decoration-none d-flex align-items-center dropdown-toggle"
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
              {JSON.parse(localStorage.getItem("user") || "{}").last_name}
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
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link
                onClick={() => logout()}
                className="dropdown-item"
                to="/login"
              >
                Đăng xuất
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
