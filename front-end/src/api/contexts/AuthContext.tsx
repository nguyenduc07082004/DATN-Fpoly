import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../interfaces/User";
import ins from "../index";
import { baseURL } from "../index";
import io from "socket.io-client";
import Swal from "sweetalert2";

export interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const socket = io(baseURL); 
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchUserData = async () => {
      try {
        const response = await ins.get(`${baseURL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUser(response.data);
        } else {
          console.warn("Không thể lấy thông tin người dùng.");
          logout(); 
        }
      } catch (error) {
        console.error("Lỗi khi gọi API lấy thông tin người dùng:", error);
        logout(); 
      }
    };

    if (token) {
      fetchUserData();
    }

    socket.on("blockUser", (data) => {
      const userParsed = JSON.parse(localStorage.getItem("user") || "{}");
      if (data && data._id === userParsed._id && data.is_blocked === true) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
        Swal.fire("Thông báo", "Tài khoản của bạn đã bị khoá!", "warning").then(() => {
          window.location.href = "/login";
        });
        setIsBlocked(true);
      }
    });
    

    return () => {
      socket.off("blockUser");
    };
  }, [isBlocked]); 

  const login = (token: string, user: User) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    nav(user.role === "admin" ? "/admin" : "/");
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

