const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');

const register = async (req, res) => {
  // Xác thực dữ liệu đầu vào
  await body('username').notEmpty().withMessage('Tên người dùng không được để trống').run(req);
  await body('email').isEmail().withMessage('Email không hợp lệ').run(req);
  await body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự').run(req);
  await body('fullname').notEmpty().withMessage('Họ tên không được để trống').run(req);
  await body('age').isNumeric().withMessage('Tuổi phải là số').run(req);
  await body('address').notEmpty().withMessage('Địa chỉ không được để trống').run(req);
  await body('phone').isNumeric().withMessage('Số điện thoại phải là số').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password, fullname, age, address, phone } = req.body;

  try {
    // Kiểm tra nếu email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại." });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullname,
      age,
      address,
      phone,
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server." });
  }
};

const login = async (req, res) => {
  await body('email').isEmail().withMessage('Email không hợp lệ').run(req);
  await body('password').notEmpty().withMessage('Mật khẩu không được để trống').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    // Kiểm tra email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });

    // Tạo token
    const token = jwt.sign({ id: user._id, role: user.role }, "secretKey", { expiresIn: "1h" });

    res.json({ message: "Đăng nhập thành công.", token });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server." });
  }
};

module.exports = { register, login };
