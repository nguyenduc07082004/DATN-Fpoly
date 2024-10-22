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
import { styled } from "@mui/system";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Styled components
const LoginContainer = styled(Box)({
  backgroundColor: "#fff",
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
});

const LoginButton = styled(Button)({
  backgroundColor: "#ff5722",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#ff3d00",
  },
});

const ErrorText = styled(Typography)({
  color: "red",
});

const ForgotPasswordLink = styled(Link)({
  display: "block",
  marginTop: "16px",
  color: "#ff5722",
  textDecoration: "none",
});

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate input fields
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("authToken", token);
      navigate("/"); // Navigate to homepage after successful login
    } catch (error) {
      setError("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <LoginContainer>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Đăng nhập
        </Typography>

        {error && <ErrorText>{error}</ErrorText>}

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

          <LoginButton
            type="submit"
            variant="contained"
            fullWidth
            sx={{ py: 1.5, mt: 2, fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Đăng nhập"}
          </LoginButton>
        </form>

        <ForgotPasswordLink to="/forgot-password">
          Quên mật khẩu?
        </ForgotPasswordLink>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2">
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" style={{ color: "#ff5722", textDecoration: "none" }}>
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </LoginContainer>
    </Container>
  );
};

export default Login;
