import Category from "../models/CategoryModels.js";
import getMessage from "../utils/getMessage.js";

// Lấy danh sách danh mục
export const getCategory = async (req, res) => {
  const lang = req.lang;
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: getMessage(lang, 'error', 'GET_CATEGORY_FAIL') || "Lỗi khi lấy danh sách danh mục",
      error,
    });
  }
};

// Lấy danh mục theo ID
export const getCategoryById = async (req, res) => {
  const lang = req.lang;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: getMessage(lang, 'error', 'CATEGORY_NOT_FOUND') || "Không tìm thấy danh mục",
      });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: getMessage(lang, 'error', 'GET_CATEGORY_BY_ID_FAIL') || "Lỗi khi lấy danh mục theo ID",
      error,
    });
  }
};

// Thêm danh mục
export const addCategory = async (req, res) => {
  const lang = req.lang;
  try {
    const { name, slug } = req.body;

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        message: getMessage(lang, 'error', 'SLUG_ALREADY_EXISTS') || "Slug đã tồn tại",
      });
    }

    let image_filename = null;
    if (req.file) {
      image_filename = req.file.filename;
    }

    if (!image_filename) {
      return res.status(400).json({
        message: getMessage(lang, 'error', 'IMAGE_REQUIRED') || "Vui lòng thêm hình ảnh",
      });
    }

    let status = req.body.status || 'active';

    const newCategory = new Category({
      name,
      slug,
      status,
      image: image_filename,
    });

    await newCategory.save();

    res.status(201).json({
      message: getMessage(lang, 'success', 'ADD_CATEGORY_SUCCESS') || "Thêm danh mục thành công",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: getMessage(lang, 'error', 'ADD_CATEGORY_FAIL') || "Lỗi khi thêm danh mục",
      error,
    });
  }
};

// Cập nhật danh mục
export const updateCategory = async (req, res) => {
  const lang = req.lang;

  try {
    let imageUrl = null;

    if (req.file) { 
     imageUrl = req.file.filename;
    }
    else {
      const category = await Category.findById(req.params.id);
      imageUrl = category.image;
    }
    const updateData = {
      ...req.body,
      image: imageUrl, 
    };

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: getMessage(lang, 'error', 'CATEGORY_NOT_FOUND') || "Không tìm thấy danh mục",
      });
    }

    res.status(200).json({
      message: getMessage(lang, 'success', 'UPDATE_CATEGORY_SUCCESS') || "Cập nhật danh mục thành công",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: getMessage(lang, 'error', 'UPDATE_CATEGORY_FAIL') || "Lỗi khi cập nhật danh mục",
      error,
    });
  }
};

// Xóa danh mục
export const deleteCategory = async (req, res) => {
  const lang = req.lang;
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: getMessage(lang, 'error', 'CATEGORY_NOT_FOUND') || "Không tìm thấy danh mục",
      });
    }

    res.status(200).json({
      message: getMessage(lang, 'success', 'DELETE_CATEGORY_SUCCESS') || "Xóa danh mục thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: getMessage(lang, 'error', 'DELETE_CATEGORY_FAIL') || "Lỗi khi xóa danh mục",
      error,
    });
  }
};
