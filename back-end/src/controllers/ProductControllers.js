import * as productService from "../services/ProductService.js";
import  getMessage from "../utils/getMessage.js"
 // Lấy danh sách sản phẩm
export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm
export const addProduct = async (req, res) => {
  const lang = req.lang;

  try {
    const { title, price, storage, color, categories, quantity, description } = req.body;
    const image_filename = req.file ? req.file.filename : null;

    const newProduct = await productService.addProduct(
      { title, price, storage, color, categories, quantity, description },
      image_filename
    );

    res.status(201).json({
      message: getMessage(lang, "success", "ADD_PRODUCT_SUCCESS"),
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: getMessage(lang, "error", "ADD_PRODUCT_FAIL") || error.message,
    });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  const lang = req.lang;

  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);

    if (!updatedProduct) {
      return res.status(404).json({
        message: getMessage(lang, "error", "UPDATE_PRODUCT_FAIL"),
      });
    }
    res.status(200).json({
      message: getMessage(lang, "success", "UPDATE_PRODUCT_SUCCESS"),
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: getMessage(lang, "error", "UPDATE_PRODUCT_FAIL") || error.message,
    });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  const lang = req.lang;
  try {
    await productService.deleteProduct(req.params.id);
    // Trả về thông báo thành công
    res.status(200).json({
      message: getMessage(lang, "success", "DELETE_PRODUCT_SUCCESS"),
    });
  } catch (error) {
    // Trả về thông báo lỗi
    const errorMessage = getMessage(lang, "error", "DELETE_PRODUCT_FAIL") || error.message;
    res.status(500).json({
      message: errorMessage,
    });
  }
};
