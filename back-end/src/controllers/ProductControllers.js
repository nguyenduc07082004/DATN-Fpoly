import * as productService from "../services/ProductService.js";
import  getMessage from "../utils/getMessage.js"
import Product from "../models/ProductModels.js"
import VariantImage from "../models/VariantImageModels.js"
import mongoose from "mongoose";
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
    const { title, description, categories, default_price } = req.body; 
    const image_filename = req.file ? req.file.filename : null;

    const newProduct = await productService.addProduct({
      title,
      description,
      categories,
      image: image_filename,
      default_price, 
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
    const { title, description, categories, variants, default_price } = req.body; 

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
      default_price, 
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

export const getVariantByProductId = async (req, res) => {
  try {
    const productId = req.params.product_id;
    const variantId = req.params.variant_id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (variantId) {
      let variant = product.variants.find((v) => v._id.toString() === variantId);

      if (!variant) {
        return res.status(404).json({ message: "Variant not found" });
      }
      // Lấy tất cả các ảnh liên quan đến variant này
      const variantImages = await VariantImage.find({ variant_id: variant._id });

      return res.status(200).json({
        product: {
          _id: product._id,
          title: product.title,
        },
        variant: {
          ...variant._doc,  // Trả về tất cả các trường của variant
          variantImages: variantImages  // Thêm thông tin ảnh của variant
        }
      });
    }

    // Nếu không có variantId, trả về tất cả các variants cùng với ảnh
    const allVariantsWithImages = [];
    for (const variant of product.variants) {
      const variantImages = await VariantImage.find({ variant_id: variant._id });
      allVariantsWithImages.push({
        ...variant._doc,  // Trả về tất cả các trường của variant
        variantImages: variantImages  // Thêm thông tin ảnh của variant
      });
    }

    res.status(200).json({
      product: {
        _id: product._id,
        title: product.title,
      },
      variants: allVariantsWithImages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const updatedData = req.body;
    let oldImages = req.body.images;  
    const images = req.files;
    let updatedVariant = {};

    if (oldImages && !Array.isArray(oldImages)) {
      oldImages = [oldImages]; 
    }

    if (updatedData.variantData) {
      try {
        updatedVariant = JSON.parse(updatedData.variantData);  
      } catch (error) {
        return res.status(400).json({ message: 'variantData is not a valid JSON string.' });
      }
    }

    const product = await Product.findById(productId).populate("variants").exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const updateProduct = product.variants.find(variant => variant._id.toString() === variantId);
    if (!updateProduct) {
      return res.status(404).json({ message: "Variant not found." });
    }

    if (updatedVariant.sku) {
      const existingVariant = product.variants.find(variant => variant.sku === updatedVariant.sku && variant._id.toString() !== variantId);
      if (existingVariant) {
        return res.status(400).json({ message: `SKU ${updatedVariant.sku} is already taken by another variant.` });
      }
    }

    for (let key in updatedData) {
      if (Object.prototype.hasOwnProperty.call(updatedData, key) && key !== 'variantImage' && key !== 'images' && key !== 'variantData') {
        updateProduct[key] = updatedData[key];
      }
    }

    for (let key in updatedVariant) {
      if (Object.prototype.hasOwnProperty.call(updatedVariant, key)) {
        updateProduct[key] = updatedVariant[key];
      }
    }

    await product.save();

    if (oldImages && oldImages.length > 0) {
      const variantImagesToKeep = oldImages.map(image => {
        image = JSON.parse(image);
        return {
          variant_id: updateProduct._id,
          url: image.url,  
          alt_text: image.alt_text || `Image`,  
          order: image.order || 0,  
        };
      });

      await VariantImage.deleteMany({ variant_id: updateProduct._id });

      if (variantImagesToKeep.length > 0) {
        await VariantImage.insertMany(variantImagesToKeep);
      }
    }

    if (images && images.length > 0) {
      const variantImages = images.map((image, index) => ({
        variant_id: updateProduct._id,
        url: image.filename || image.originalname, 
        alt_text: updatedData.alt_text || `Image ${index + 1}`,  
        order: index,
      }));

      if (variantImages.length > 0) {
        await VariantImage.insertMany(variantImages);
      } else {
        console.log("No new images to insert");
      }
    }

    res.status(200).json({ message: "Variant updated successfully.", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

















export const deleteVariant = async (req, res) => {
  try {
    const { product_id, variant_id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      product_id,
      {
        $pull: { variants: { _id: variant_id } },
      },
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    const isVariantDeleted = !updatedProduct.variants.some(
      (variant) => variant._id.toString() === variant_id
    );

    if (!isVariantDeleted) {
      return res.status(404).json({ message: "Variant not found." });
    }

    res.status(200).json({ message: "Variant deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
