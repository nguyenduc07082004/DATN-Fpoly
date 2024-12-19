import Category from "../models/CategoryModels.js";
import Product from "../models/ProductModels.js";
import {io} from "../../index.js"
export const getDeletedItems = async (req, res) => {
  try {

    // Lấy tất cả categories bị xóa
    const deletedCategories = await Category.find({ deleted_at: { $ne: null } });

    // Lấy tất cả products bị xóa
    const deletedProducts = await Product.find({ deleted_at: { $ne: null } });

    // Lấy tất cả variants bị xóa từ các products
    const deletedVariants = [];
    const productsWithVariants = await Product.find();
    for (const product of productsWithVariants) {
      console.log(product,"doask")
      const variants = product.variants.filter((variant) => variant.deleted_at !== null);
      deletedVariants.push(...variants);
    }

    res.status(200).json({
      categories: deletedCategories,
      products: deletedProducts,
      variants: deletedVariants,
    });
  } catch (error) {
    console.error("Error fetching deleted items:", error);
    res.status(500).json({ message: "Error fetching deleted items" });
  }
};

export const restoreItem = async (req, res) => {
  const { type, id } = req.params;
  console.log(req.params)
  try {
    if (type === "categories") {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Không có danh mục này" });
      }

      category.deleted_at = null; 
      await category.save();
      io.emit("new_category", category);

      return res.status(200).json({ message: "Phục hồi danh mục thành công" });
    }

    if (type === "products") {
      // Phục hồi product
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Không có sản phẩm này" });
      }

      product.deleted_at = null; // Cập nhật deleted_at về null
      await product.save();
      io.emit("new_product", product);

      // Phục hồi các variants nếu có
      for (let variant of product.variants) {
        if (variant.deleted_at !== null) {
          variant.deleted_at = null; // Phục hồi variant
          await variant.save();
        }
      }

      return res.status(200).json({ message: "Phục hồi sản phẩm thành công" });
    }

    if (type === "variants") {
      // Phục hồi variant
      const product = await Product.findOne({ "variants._id": id });

      if (!product) {
        return res.status(404).json({ message: "Không có sản phẩm này" });
      }

      const variant = product.variants.id(id);
      if (!variant) {
        return res.status(404).json({ message: "Không có biến thể này" });
      }
      variant.deleted_at = null; 
      await product.save(); 
      io.emit("new_product", product);
      return res.status(200).json({ message: "Phục hồi biến thể thành công" });
    }

    return res.status(400).json({ message: "Lỗi dữ liệu" });
  } catch (error) {
    console.error("Error restoring item:", error);
    res.status(500).json({ message: "Error restoring item" });
  }
};
