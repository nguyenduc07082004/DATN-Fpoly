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
      username, // Thêm trường username
      fullName,
      email,
      password: hashedPassword,
      address,
      phone,
    });

    await newUser.save();

    // Tạo token sau khi đăng ký
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, "secretKey", {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "Đăng ký thành công.", token, user: newUser });
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

    res.json({ message: "Đăng nhập thành công.", token, user: user });
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
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm người dùng dựa trên id
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng.", error });
  }
};
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token đã giải mã
    const user = await User.findById(userId).select("-password"); // Không trả về mật khẩu

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng.", error });
  }
};
module.exports = { register, login, getUser , getUserById ,getCurrentUser};
