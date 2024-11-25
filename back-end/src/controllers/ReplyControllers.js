import Comment from "../models/CommentsModels.js"
import Reply from "../models/ReplyModels.js"
import getMessage from "../utils/getMessage.js"
export const getCommentsWithReplies = async (req, res) => {
    const lang = req.lang || "en"; 
    try {
      const comments = await Comment.find()
        .populate("userId", "firstName lastName email")
        .populate("productId", "name price")
        .sort({ createdAt: -1 })
        .lean();
  
      for (let comment of comments) {
        const replies = await Reply.find({ commentId: comment._id })
          .populate("userId", "firstName lastName email")
          .sort({ createdAt: 1 });
  
        comment.replies = replies;
      }
  
      return res.status(200).json({
        success: true,
        message: getMessage(lang, 'success', 'COMMENTS_FETCHED'),
        data: comments,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: getMessage(lang, 'error', 'SERVER_ERROR') });
    }
  };
  

  export const addReply = async (req, res) => {
    const lang = req.lang || "en"; 
    const {userId, reply } = req.body;
    const { commentId } = req.params;
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ success: false, message: getMessage(lang, 'error', 'COMMENT_NOT_FOUND') });
      }
  
      const newReply = new Reply({
        commentId,
        userId,
        reply,
      });
  
      await newReply.save();
  
      return res.status(201).json({
        success: true,
        message: getMessage(lang, 'success', 'REPLY_ADDED'),
        data: newReply,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: getMessage(lang, 'error', 'SERVER_ERROR') });
    }
  };