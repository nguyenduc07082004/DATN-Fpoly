const Product = require("../models/ProductModels"); // Giả sử bạn đã định nghĩa một model cho Product

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {

    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục theo id", error });
  }
};

// Thêm sản phẩm
exports.addProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Sản phẩm đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
};
