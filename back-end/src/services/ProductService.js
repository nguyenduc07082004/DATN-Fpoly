import Product from "../models/ProductModels.js";
import Category from "../models/CategoryModels.js";

// Lấy danh sách sản phẩm
export const getAllProducts = async () => {
  try {
    return await Product.find().populate("categories", "name description");
  } catch (error) {
    throw error; 
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId).populate("categories", "name description");
    if (!product) {
      throw new Error("Product not found"); 
    }
    return product;
  } catch (error) {
    throw error;
  }
};

// Thêm sản phẩm
export const addProduct = async (productData, imageFilename) => {
  const { title, price, storage, color, categories, quantity, description } = productData;

  try {
    // Kiểm tra danh mục
    const categoryExists = await Category.findById(categories);
    if (!categoryExists) {
      throw new Error("Category not found");
    }

    // Tạo sản phẩm mới
    const newProduct = new Product({
      title,
      price,
      storage,
      color,
      image: imageFilename,
      categories,
      quantity,
      description,
    });
    return await newProduct.save();
  } catch (error) {
    throw error; 
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (productId, productData) => {
  const { categories } = productData;

  try {
    // Kiểm tra danh mục
    const categoryExists = await Category.findById(categories);
    if (!categoryExists) {
      throw new Error("Category not found");
    }

    // Cập nhật sản phẩm
    return await Product.findByIdAndUpdate(productId, productData, { new: true }).populate("categories", "name description");
  } catch (error) {
    throw error; 
  }
};

// Xóa sản phẩm
export const deleteProduct = async (productId) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      throw new Error("Product not found");
    }
    return deletedProduct;
  } catch (error) {
    throw error; 
  }
};
