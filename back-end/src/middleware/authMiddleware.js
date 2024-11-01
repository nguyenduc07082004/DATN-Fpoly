const jwt = require("jsonwebtoken");

// Middleware xác thực người dùng qua JWT
exports.verifyToken = (req, res, next) => {
  // Lấy token từ header của yêu cầu
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    // Xác thực và giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET là khóa bí mật trong biến môi trường
    req.user = decoded; // Lưu thông tin người dùng vào req để sử dụng tiếp
    next(); // Cho phép tiếp tục nếu xác thực thành công
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};
