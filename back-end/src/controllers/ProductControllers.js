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
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm
export const addProduct = async (req, res) => {
  const lang = req.lang;
  try {
    const { title, description, categories } = req.body;
    const image_filename = req.file ? req.file.filename : null;

    const newProduct = await productService.addProduct({
      title,
      description,
      categories,
      image: image_filename,
    });

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
    const { title, description, categories, variants } = req.body;

    let image = null;
    if (req.file) {
      image = req.file.filename; 
    }

    const updateData = {
      title,
      description,
      categories,
      variants,
      image, 
    };

    const updatedProduct = await productService.updateProduct(req.params.id, updateData);

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
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        message: getMessage(lang, "error", "DELETE_PRODUCT_FAIL"),
      });
    }
    res.status(200).json({
      message: getMessage(lang, "success", "DELETE_PRODUCT_SUCCESS"),
    });
  } catch (error) {
    res.status(500).json({
      message: getMessage(lang, "error", "DELETE_PRODUCT_FAIL") || error.message,
    });
  }
};

export const createVariant = async (req, res) => {
  const lang = req.lang;

  try {
    const { productId, variantData } = req.body;

    const images = req.files;  // Lấy ảnh từ req.files
    // Kiểm tra productId và variantData
    if (!productId || !variantData) {
      return res.status(400).json({
        message: getMessage(lang, "error", "MISSING_FIELDS"),
      });
    }

    const createdVariant = await productService.createVariant(productId, variantData, images);

    if (!createdVariant) {
      return res.status(404).json({
        message: getMessage(lang, "error", "CREATE_VARIANT_FAIL"),
      });
    }

    res.status(201).json({
      message: getMessage(lang, "success", "CREATE_VARIANT_SUCCESS"),
      data: createdVariant,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || getMessage(lang, "error", "CREATE_VARIANT_FAIL"),
    });
  }
};


export const getProductsWithoutVariants = async (req, res) => {
  try {
    const products = await productService.getProductsWithPriceRange();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFilteredProducts = async (req, res) => {
  try {
    // Lấy các tham số từ request query
    const { page = 1, limit = 10, searchTerm, minPrice, maxPrice, rating } = req.query;

    // Xây dựng bộ lọc
    const filters = {};

    // Tìm kiếm tiêu đề sản phẩm
    if (searchTerm) {
      filters.title = { $regex: searchTerm, $options: "i" }; // Không phân biệt hoa thường
    }

    // Lọc theo giá
    if (minPrice || maxPrice) {
      filters["variants.price"] = {}; // Lọc trong variants.price
      if (minPrice) filters["variants.price"].$gte = Number(minPrice);
      if (maxPrice) filters["variants.price"].$lte = Number(maxPrice);
    }

    // Lọc theo đánh giá trung bình
    if (rating) {
      filters.averageRating = { $gte: Number(rating) };
    }

    // Gọi service để lấy dữ liệu
    const result = await productService.getFilteredProductsService(filters, Number(page), Number(limit));

    // Trả về phản hồi
    return res.status(200).json({
      success: true,
      data: result,
      message: "Filtered products fetched successfully",
    });
  } catch (error) {
    console.error("Error in getFilteredProducts controller:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
