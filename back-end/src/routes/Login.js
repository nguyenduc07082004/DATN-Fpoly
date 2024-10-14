const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Đăng ký
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Tài khoản không tồn tại' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không chính xác' });
    }

    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Chưa cấu hình JWT_SECRET trong môi trường' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },process.env.JWT_SECRET,{ expiresIn: '1h' }
    );

    return res.status(200).json({ message: 'Đăng nhập thành công', token });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return res.status(500).json({ message: 'Lỗi server', error });
  }
});

module.exports = router;
