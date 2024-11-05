import Category from "../models/CategoryModels.js";
import Product from "../models/ProductModels.js";

// Lấy danh sách sản phẩm
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate(
      "categories",
      "name description"
    ); // populate name và description của danh mục
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categories",
      "name description"
    );
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
  }
};

// Thêm sản phẩm
export const addProduct = async (req, res) => {
  const { title, price, storage, color, categories, quantity, description } =
    req.body;
  let image_filename = req.file ? req.file.filename : null;

  try {
    // Kiểm tra xem danh mục có tồn tại không
    const categoryExists = await Category.findById(categories);
    if (!categoryExists) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }

    // Tạo sản phẩm mới
    const newProduct = new Product({
      title,
      price,
      storage,
      color,
      image: image_filename,
      categories,
      quantity,
      description,
    });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  const { categories } = req.body;

  try {
    // Kiểm tra xem danh mục có tồn tại không
    const categoryExists = await Category.findById(categories);
    if (!categoryExists) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }

    // Cập nhật sản phẩm
    const updatedProduct = await ProductModels.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("categories", "name description");
    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({ message: "Sản phẩm đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
};
