const Product = require("../models/ProductModels"); 
const Category = require('../models/CategoryModels'); // Giả sử bạn đã định nghĩa một model cho Product

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('categories', 'name description'); // populate name và description của danh mục
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categories', 'name description');
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
  }
};

// Thêm sản phẩm
exports.addProduct = async (req, res) => {
  const { categories } = req.body;

  try {
    // Kiểm tra xem danh mục có tồn tại không
    const categoryExists = await Category.findById(categories);
    if (!categoryExists) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }

    // Tạo sản phẩm mới
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  const { categories } = req.body;

  try {
    // Kiểm tra xem danh mục có tồn tại không
    const categoryExists = await Category.findById(categories);
    if (!categoryExists) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }

    // Cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('categories', 'name description');
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.status(200).json({ message: "Sản phẩm đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
};