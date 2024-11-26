import UserModels from "../models/UserModels.js";
import { hassPassword , comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import getMessage from "../utils/getMessage.js";
export const register = async (req, res, next) => {
  try {
    const lang = req.lang || "en";
    const { first_name, last_name, email, password, address, phone, role } = req.body;

    // Kiểm tra email hợp lệ
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: getMessage(lang, 'error', 'INVALID_EMAIL'),
      });
    }

    // Kiểm tra nếu email đã tồn tại
    const userExists = await UserModels.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: getMessage(lang, 'error', 'EMAIL_EXIST'),
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await hassPassword(password, 10);
    if (!hashedPassword) {
      return res.status(400).json({
        message: getMessage(lang, 'error', 'CREATE_FAIL'),
      });
    }

    // Tạo người dùng mới
    const user = await UserModels.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      address,
      phone,
      role,
    });

    // Xóa mật khẩu khỏi dữ liệu trả về
    user.password = undefined;

    return res.status(201).json({
      success: true,
      user,
      message: getMessage(lang, 'success', 'REGISTER_SUCCESS'),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  const lang = req.lang || "en";
  const { email, password } = req.body;

  try {
    // Kiểm tra email có tồn tại không
    const userExists = await UserModels.findOne({ email });
    if (!userExists) {
      return res.json({ success: false, message: getMessage(lang, 'error', 'EMAIL_NOT_FOUND') });
    }

    // Kiểm tra tài khoản có bị block hay không
    if (userExists.is_blocked) {
      return res.json({ success: false, message: getMessage(lang, 'error', 'ACCOUNT_BLOCKED') });
    }

    // Kiểm tra mật khẩu có đúng không
    const isMatch = await comparePassword(password, userExists.password);
    if (!isMatch) {
      return res.json({ success: false, message: getMessage(lang, 'error', 'PASSWORD_NOT_MATCH') });
    }

    // Nếu tài khoản hợp lệ và chưa bị block, cập nhật trạng thái is_active thành true
    if (!userExists.is_active) {
      userExists.is_active = true;
      await userExists.save();
    }

    // Tạo JWT token
    const token = generateToken({ _id: userExists._id }, "100d");

    return res.status(200).json({
      success: true,
      user: userExists,
      token: token,
      message: getMessage(lang, 'success', 'LOGIN_SUCCESS'),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: getMessage(lang, 'error', 'SERVER_ERROR') });
  }
};

export const logout = async (req, res) => {
  const lang = req.lang || "en";  
  const userId = req.user._id;

  try {
    const user = await UserModels.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: getMessage(lang, 'error', 'USER_NOT_FOUND') });
    }

    user.is_active = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: getMessage(lang, 'success', 'LOGOUT_SUCCESS'),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: getMessage(lang, 'error', 'SERVER_ERROR') });
  }
};

export const blockUser = async (req, res) => {
  const lang = req.lang || "en";
  const { userId, is_blocked } = req.body;
  const adminId = req.user?._id;

  try {
    const admin = await UserModels.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: getMessage(lang, "error", "USER_NOT_FOUND") });
    }

    if (admin.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: getMessage(lang, "error", "NOT_AUTHORIZED") });
    }

    const user = await UserModels.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: getMessage(lang, "error", "USER_NOT_FOUND") });
    }

    user.is_blocked = is_blocked;
    await user.save();

    return res.status(200).json({
      success: true,
      message: getMessage(lang, "success", is_blocked ? "BLOCK_SUCCESS" : "UNBLOCK_SUCCESS"),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: getMessage(lang, "error", "SERVER_ERROR") });
  }
};

export const getUser = async (req, res) => {
  const lang = req.lang || "en";
  try {
    const users = await UserModels.find({ role: { $ne: 'admin' } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: getMessage(lang, 'error', 'GET_FAIL'), error });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const lang = req.lang || "en";

  try {
    const user = await UserModels.findById(id);
    if (!user) return res.status(404).json({ message: getMessage(lang, 'error', 'NOT_FOUND') });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: getMessage(lang, 'error', 'SERVER_ERROR'), error });
  }
};

export const getCurrentUser = async (req, res) => {
  const lang = req.lang || "en";

  try {
    const userId = req.user.id; 
    const user = await UserModels.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: getMessage(lang, 'error', 'NOT_FOUND') });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: getMessage(lang, 'error', 'SERVER_ERROR'), error });
  }
};
