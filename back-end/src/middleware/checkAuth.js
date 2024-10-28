const User = require("../models/UserModels");

const { verifyToken } = require("../utils/jwt.js");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        message: "Nguoi dung chua dang nhap!",
      });
    }
    const decode = verifyToken(token);
    if (!decode) {
      return res.status(400).json({
        message: "Token khong hop le!",
      });
    }
    const user = await User.findById(decode._id);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = { checkAuth };
