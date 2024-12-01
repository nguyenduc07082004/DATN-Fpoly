import Product from "../models/ProductModels.js";
import VariantImage from "../models/VariantImageModels.js"; // Import model VariantImage
import Comment from "../models/CommentsModels.js";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
// Lấy danh sách sản phẩm
export const getAllProducts = async () => {
  try {
    return await Product.find().populate("categories", "name description");
  } catch (error) {
    throw error; 
  }
};

export const getProductsWithPriceRange = async () => {
  try {
    const products = await Product.aggregate([
      {
        $match: {
          variants: { $ne: [] } 
        }
      },
      {
        $unwind: "$variants" 
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" }, 
          price: { $min: "$variants.price" },
          maxPrice: { $max: "$variants.price" }, 
          image: { $first: "$image" }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1, 
          priceRange: { 
            $concat: [
              { $toString: "$price" }, 
              " - ", 
              { $toString: "$maxPrice" }
            ] 
          }, 
          price: 1,
          image: 1 
        }
      }
    ]);
    return products;
  } catch (error) {
    throw new Error('Error fetching products with price range: ' + error.message);
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId)
    .populate("categories", "name description")  
    .exec();  
  
  for (let variant of product.variants) {
    const variantImages = await VariantImage.find({ variant_id: variant._id }); 
    variant.variantImages = variantImages;
  }

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
  try {
    const product = new Product(productData);
    return await product.save(); 
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;  
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (productId, updateData) => {
  try {
    if(updateData.image == null) {
      const product = await Product.findById(productId);
      updateData.image = product.image;
    }
    return await Product.findByIdAndUpdate(productId, updateData, { new: true });
  } catch (error) {
    throw new Error('Failed to update product');
  }
};


// Xóa sản phẩm
export const deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};



export const createVariant = async (productId, variantData, files) => {
  // Lấy thư mục gốc của dự án
  const projectRoot = process.cwd(); // process.cwd() trả về thư mục gốc của dự án

  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (variantData) { 
      variantData = JSON.parse(variantData);
    }

    const isSkuExist = product.variants.some(variant => variant.sku === variantData.sku);
    if (isSkuExist) {
      throw new Error("SKU already exists");
    }

    // Đầu tiên, thêm variant mới vào sản phẩm
    product.variants.push(variantData);
    const savedProduct = await product.save();

    let variantImages = [];

    if (files && files.length > 0) {
      // Đảm bảo thư mục uploads tồn tại (ở thư mục gốc của dự án)
      const uploadDir = path.join(projectRoot, "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      // Chờ tải lên tất cả ảnh trước khi thêm variant
      const uploadPromises = files.map((file, index) => {
        return new Promise((resolve, reject) => {
          const fileName = `${Date.now()}-${index}${path.extname(file.originalname)}`.replace(/[^\w\s.-]/g, '_');
          const filePath = path.join(uploadDir, fileName);

          // Di chuyển file từ bộ nhớ tạm vào thư mục uploads
          fs.rename(file.path, filePath, (err) => {
            if (err) {
              return reject(err); // Nếu lỗi, trả về lỗi
            }

            // Nếu tải ảnh thành công, tạo đối tượng ảnh
            variantImages.push({
              variant_id: savedProduct.variants[savedProduct.variants.length - 1]._id,
              url: `${fileName}`,  // Đảm bảo đường dẫn phù hợp
              alt_text: `Image ${index + 1}`,
              order: index,
            });

            resolve();
          });
        });
      });

      // Đợi tất cả các file được tải lên
      await Promise.all(uploadPromises);
    }

    // Nếu có ảnh, insert vào VariantImage sau khi tất cả ảnh đã được tải lên thành công
    if (variantImages.length > 0) {
      await VariantImage.insertMany(variantImages);
    }

    return savedProduct;

  } catch (error) {
    console.error("Error creating variant:", error);
    // Nếu có lỗi trong quá trình tải ảnh, loại bỏ variant đã tạo
    throw new Error("Failed to create variant: " + error.message);
  }
};



export const getFilteredProductsService = async (filters, pagination) => {
  try {
    const { searchTerm, rating, categories, min_price, max_price } = filters;
    const { page, limit } = pagination;

    const query = {};

    // Lọc theo từ khóa tìm kiếm (searchTerm)
    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' }; 
    }

    // Lọc theo danh mục (categories)
    if (categories) {
      query.categories = new mongoose.Types.ObjectId(categories); 
    }

    // Lọc theo giá
    if (min_price && max_price) {
      query.default_price = { $gte: Number(min_price), $lte: Number(max_price) };
    } else if (min_price) {
      query.default_price = { $gte: Number(min_price) };
    } else if (max_price) {
      query.default_price = { $lte: Number(max_price) };
    }

    // Tính tổng số sản phẩm (total count)
    const totalCount = await Product.countDocuments(query);

    // Tính toán số trang (total pages)
    const totalPages = Math.ceil(totalCount / limit);

    // Lấy các sản phẩm với phân trang
    const products = await Product.find(query)
      .populate("variants")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Tính điểm trung bình của sản phẩm từ các bình luận
    for (let product of products) {
      const ratings = await Comment.aggregate([
        { $match: { productId: product._id } },
        { $group: { _id: null, averageRating: { $avg: "$rating" } } }
      ]);

      product.averageRating = ratings.length > 0 ? ratings[0].averageRating : 0;
    }

    // Lọc theo đánh giá
    const filteredProducts = products.filter(product => product.averageRating >= rating);

    return {
      products: filteredProducts,
      totalCount,
      totalPages
    };
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};





