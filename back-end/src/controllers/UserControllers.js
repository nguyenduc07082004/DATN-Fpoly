import UserModels from "../models/UserModels.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { hassPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res, next) => {
  try {
    /**
     * 1. Kiem tra email co dk dang ky trong he thong chua?
     * 2. Ma ma password
     * 3. Khoi tao user moi
     * 4. Thong bao thanh cong
     */

    const { username, email, password, fullName, address, phone } = req.body;
    const useExists = await UserModels.findOne({ email });
    console.log(useExists);
    if (useExists) {
      return res.status(400).json({
        message: "Email da ton tai",
      });
    }

    const hassPass = hassPassword(password);
    if (!hassPass) {
      return res.status(400).json({
        message: "Ma hoa mat khau that bai!",
      });
    }

    const user = await UserModels.create({
      email,
      password: hassPass,
      username,
      fullName,
      address,
      phone,
    });

    user.password = undefined;

    return res.status(201).json({
      success: true,
      user,
      message: "Dang ky thanh cong!",
    });
  } catch (error) {
    next(error);
  }
};

// const login = async (req, res, next) => {
//   try {

//     const { email, password } = req.body;
//     const useExists = await User.findOne({ email });
//     console.log(useExists);
//     if (!useExists) {
//       return res.status(404).json({
//         message: "Email chua dang ky!",
//       });
//     }

//     const isMatch = comparePassword(password, useExists.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         message: "Mat khau khong dung!",
//       });
//     }

//     const token = jwt.sign({ _id: useExists._id }, "100d");
//     console.log(token);
//     useExists.password = undefined;

//     return res.status(200).json({
//       success: true,
//       user: useExists,
//       token: token,
//       message: "Login successfully!",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const useExists = await UserModels.findOne({ email });
    if (!useExists) {
      return res.json({ success: false, message: "User Doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, useExists.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken({ _id: useExists._id }, "100d");
    return res.status(200).json({
      success: true,
      user: useExists,
      token: token,
      message: "Login successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModels.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách ", error });
  }
};
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm người dùng dựa trên id
    const user = await UserModels.findById(id);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại." });

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin người dùng.", error });
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token đã giải mã
    const user = await UserModels.findById(userId).select("-password"); // Không trả về mật khẩu

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin người dùng.", error });
  }
};
