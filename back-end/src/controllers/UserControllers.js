const User = require("../models/UserModels");


// Lấy danh sách sản phẩm
exports.getUser = async (req, res) => {
  try {

    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
  }
};

// Thêm sản phẩm
exports.addUser = async (req, res) => {
  const newuser = new User(req.body);
  try {
    const saveuser = await newuser.save();
    res.status(201).json(saveuser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error });
  }
};

// Cập nhật sản phẩm
exports.updateUser = async (req, res) => {
  try {
    const Updateuser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(Updateuser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error });
  }
};

// Xóa sản phẩm
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Sản phẩm đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
};
