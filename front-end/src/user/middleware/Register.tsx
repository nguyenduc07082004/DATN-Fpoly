// src/components/Register.tsx

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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../css/Style.css";

const Register: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!fullName || !email || !phone || !password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/register", {
        fullName,
        email,
        phone,
        password,
        address,
      });

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box className="register-container">
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Đăng ký tài khoản
        </Typography>

        {error && <Typography className="error-text">{error}</Typography>}

        <form onSubmit={handleRegister}>
          <TextField
            label="Họ và tên"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Số điện thoại"
            type="tel"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <TextField
            label="Địa chỉ"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
            className="register-button"
            sx={{ py: 1.5, mt: 2, fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng ký"
            )}
          </Button>
        </form>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              style={{ color: "#ff5722", textDecoration: "none" }}
            >
              Đăng nhập ngay
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
