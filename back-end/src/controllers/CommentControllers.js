import Comment from '../models/CommentsModels.js';
import Product from '../models/ProductModels.js';
import User from '../models/UserModels.js';
import getMessage from '../utils/getMessage.js';
import Reply from '../models/ReplyModels.js';

export const addCommentAndRating = async (req, res) => {
  const lang = req.lang || "vi"; 
  const { productId, userId, rating, comment } = req.body;

  try {
    // Kiểm tra sự tồn tại của sản phẩm
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: getMessage(lang, 'error', 'PRODUCT_NOT_FOUND') });
    }

    // Kiểm tra sự tồn tại của người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: getMessage(lang, 'error', 'USER_NOT_FOUND') });
    }

    // Kiểm tra rating hợp lệ (nếu có)
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ success: false, message: getMessage(lang, 'error', 'INVALID_RATING') });
    }

    // Kiểm tra xem người dùng đã có đánh giá cho sản phẩm này chưa
    const existingComment = await Comment.findOne({ productId, userId });
    if (existingComment) {
      return res.status(400).json({ success: false, message: getMessage(lang, 'error', 'USER_ALREADY_RATED') });
    }

    // Tạo bình luận mới
    const newComment = new Comment({
      productId,
      userId,
      rating: rating || null,  
      comment,
    });

    await newComment.save();

    return res.status(201).json({
      success: true,
      message: getMessage(lang, 'success', 'COMMENT_ADDED'),
      data: newComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: getMessage(lang, 'error', 'SERVER_ERROR') });
  }
};


export const getCommentsByProduct = async (productId, lang = "en") => {
  try {
    const comments = await Comment.find({ productId })
      .populate("userId", "first_name last_name email") 
      .populate("productId", "name price") 
      .sort({ createdAt: -1 }); 

    if (!comments || comments.length === 0) {
      return { message: getMessage(lang, 'error', 'NO_COMMENTS_FOR_PRODUCT') };
    }

    return comments;
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    throw new Error(getMessage(lang, 'error', 'SERVER_ERROR')); 
  }
};

export const getComments = async (req, res) => {
  const lang = req.lang || "en"; 
  try {
    const comments = await Comment.find().populate("userId", "first_name last_name email").populate("productId", "name price").sort({ createdAt: -1 });
   res.status(200).json(comments)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: getMessage(lang, 'error', 'SERVER_ERROR') });
  }
};


export const getCommentsWithReplies = async (req, res) => {
  const lang = req.lang || "en"; 
  const { productId } = req.params;

  try {
    const comments = await Comment.find({ productId })
      .populate("userId", "first_name last_name email")
      .populate("productId", "name price")
      .sort({ createdAt: -1 })
      .lean();

    const totalRating = comments.reduce((acc, comment) => acc + comment.rating, 0);
    const averageRating = comments.length > 0 ? totalRating / comments.length : 0;

   for (let comment of comments) {
      const replies = await Reply.find({ commentId: comment._id })
        .populate("userId", "first_name last_name email")
        .sort({ createdAt: 1 });
      comment.replies = replies;
    }

    res.status(200).json({ comments, averageRating });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: getMessage(lang, 'error', 'SERVER_ERROR') });
  }
};

