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
export const addProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save(); 
};


// Cập nhật sản phẩm
export const updateProduct = async (productId, updateData) => {
  return await Product.findByIdAndUpdate(productId, updateData, { new: true });
};


// Xóa sản phẩm
export const deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};


export const createVariant = async (productId, variantData) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const isSkuExist = product.variants.some(variant => variant.sku === variantData.sku);
  if (isSkuExist) {
    throw new Error("Sku already exists");
  }

  product.variants.push(variantData);

  return await product.save();
};

