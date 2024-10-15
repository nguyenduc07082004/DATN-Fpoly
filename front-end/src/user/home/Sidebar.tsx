import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const UserSidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img
          src="/path/to/your/logo.png"
          alt="SmartShop Logo"
          className="sidebar-logo-img"
        />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Phones</Link>
          </li>
          <li>
            <Link to="/accessories">Accessories</Link>
          </li>
          <li>
            <Link to="/deals">Deals</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
          <li>
            <Link to="/profile">My Profile</Link>
          </li>
          <li>
            <Link to="/admin">My Profile</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserSidebar;
