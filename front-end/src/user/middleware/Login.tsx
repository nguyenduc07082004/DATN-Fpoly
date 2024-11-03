// src/components/Login.tsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Token, Visibility, VisibilityOff } from "@mui/icons-material";
import ins from "../../api";
import { useAuth } from "../../api/contexts/AuthContext";
import "../css/Style.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      setLoading(false);
      return;
    }

    try {
      
        const { data } = await ins.post("/login", { email, password });
        contextLogin(data.token, data.user);
        navigate(data.user.role === "admin" ? "/admin" : "/");
      
     
    } catch (error) {
      setError("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box className="login-container">
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Đăng nhập
        </Typography>

        {error && <Typography className="error-text">{error}</Typography>}

        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            helperText={!email && "Vui lòng nhập email."}
          />
          <TextField
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText={!password && "Vui lòng nhập mật khẩu."}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="login-button"
            sx={{ py: 1.5, mt: 2, fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>

        <Link to="/forgot-password" className="forgot-password-link">
          Quên mật khẩu?
        </Link>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              style={{ color: "#ff5722", textDecoration: "none" }}
            >
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
