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
import { styled } from "@mui/system";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Styled components
const RegisterContainer = styled(Box)({
  backgroundColor: "#fff",
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
});

const RegisterButton = styled(Button)({
  backgroundColor: "#ff5722",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#ff3d00",
  },
});

const ErrorText = styled(Typography)({
  color: "red",
});

const Register: React.FC = () => {
  const [fullName, setFullName] = useState(""); // Thêm trạng thái cho Họ và tên
  const [address, setAddress] = useState(""); // Thêm trạng thái cho Họ và tên
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Thêm trạng thái cho Số điện thoại
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate input fields
    if (!fullName || !email || !phone || !password) {
      setError("Vui lòng điền đầy đủ thông tin."); // Thông báo lỗi nếu không điền đủ
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
      console.log(response);

      if (response.status === 201) {
        navigate("/login"); // Redirect to login page after successful registration
      }
    } catch (error) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <RegisterContainer>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Đăng ký tài khoản
        </Typography>

        {error && <ErrorText>{error}</ErrorText>}

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

          <RegisterButton
            type="submit"
            variant="contained"
            fullWidth
            sx={{ py: 1.5, mt: 2, fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng ký"
            )}
          </RegisterButton>
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
      </RegisterContainer>
    </Container>
  );
};

export default Register;
