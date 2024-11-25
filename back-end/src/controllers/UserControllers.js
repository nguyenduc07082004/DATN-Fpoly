import UserModels from "../models/UserModels.js";
import { hassPassword , comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import getMessage from "../utils/getMessage.js";

export const register = async (req, res, next) => {
  try {
    const lang = req.lang || "en";
    const { first_name, last_name, email, password, address, phone, role } = req.body;
    console.log(req.body)

    // Kiểm tra nếu email đã tồn tại
    const userExists = await UserModels.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: getMessage(lang, 'error', 'EMAIL_EXIST'),
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await hassPassword(password);
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

    // Kiểm tra mật khẩu có đúng không
    const isMatch = await comparePassword(password, userExists.password);
    if (!isMatch) {
      return res.json({ success: false, message: getMessage(lang, 'error', 'PASSWORD_NOT_MATCH') });
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

export const getUser = async (req, res) => {
  const lang = req.lang || "en";
  try {
    const users = await UserModels.find();
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
