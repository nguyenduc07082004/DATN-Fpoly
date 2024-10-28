const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password, fullName, address, phone } = req.body;

  try {
    // Kiểm tra nếu email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại." });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      username,
      email,
      fullName,
      password: hashedPassword,
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
  const { email, password } = req.body;

  try {
    // Kiểm tra email
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng." });

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng." });

    // Tạo token
    const token = jwt.sign({ id: user._id, role: user.role }, "secretKey", {
      expiresIn: "1h",
    });

    res.json({ message: "Đăng nhập thành công.", token });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server." });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách ", error });
  }
};

module.exports = { register, login, getUser };
