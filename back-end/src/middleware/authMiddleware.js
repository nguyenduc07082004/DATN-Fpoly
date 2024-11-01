const jwt = require("jsonwebtoken");

// Middleware xác thực người dùng qua JWT
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).json({ success: false, message: "Access denied. No token provided." });
  }

  const actualToken = token.split(" ")[1]; // Lấy token thực tế

  try {
    // Sử dụng biến môi trường cho khóa bí mật
    const decoded = jwt.verify(actualToken, "secretKey");
    req.user = decoded; // Lưu thông tin người dùng vào req để sử dụng tiếp
    next(); // Cho phép tiếp tục nếu xác thực thành công
  } catch (error) {
    console.error("Token verification error:", error); // Log lỗi ra console
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};
