import CategoryModels from "../models/CategoryModels.js";
// Lấy danh sách sản phẩm
export const getCategory = async (req, res) => {
  try {
    const category = await CategoryModels.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModels.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục theo id", error });
  }
};

// Thêm sản phẩm
export const addCategory = async (req, res) => {
  const newCategory = new Category(req.body);
  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error });
  }
};

// Cập nhật sản phẩm
export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await CategoryModels.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error });
  }
};

// Xóa sản phẩm
export const deleteCategory = async (req, res) => {
  try {
    await CategoryModels.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Sản phẩm đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
};
