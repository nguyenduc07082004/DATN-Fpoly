import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../css/Style.css";
import ins from "../../api";
import { baseURL } from "../../api";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false); // Trạng thái modal
  const [modalMessage, setModalMessage] = useState(""); // Thông điệp hiển thị trong modal
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!firstName || !lastName || !email || !phone || !password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    try {
      const response = await ins.post(`${baseURL}/register`, {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        password,
        role,
      });

      if (response.status === 201) {
        setModalMessage("Đăng ký thành công! Vui lòng đăng nhập.");
        setOpenModal(true); // Mở modal thông báo
        setTimeout(() => navigate("/login"), 2000); // Chờ 2 giây rồi điều hướng đến trang đăng nhập
      }
    } catch (error: any) {
      setError(error.response.data.message);
      setLoading(false);
      setModalMessage("Đã có lỗi xảy ra!"); // Thông báo lỗi
      setOpenModal(true); // Mở modal thông báo lỗi
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
            label="Họ"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Tên"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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

      {/* Modal thông báo */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              {modalMessage}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenModal(false)}
              sx={{ mt: 2 }}
            >
              Đóng
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default Register;
