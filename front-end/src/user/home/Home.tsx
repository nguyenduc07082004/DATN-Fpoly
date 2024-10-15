import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Avatar, Tooltip } from "@mui/material";
import Logo from "../../assets/logoshop.jpg";

export const Header: React.FC = () => {
  const [username, setUsername] = useState<string>("Unknown");
  const [avatar, setAvatar] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedAvatar = localStorage.getItem("avatar");
    if (storedUsername) setUsername(storedUsername);
    if (storedAvatar) setAvatar(storedAvatar);
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img
          src={Logo}
          alt="Logo"
          className="img-fluid"
          style={{ width: "100px", cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        />
      </div>
      <div className="header-left">
        <Tooltip title={username}>
          <Avatar alt={username} src={avatar} />
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
