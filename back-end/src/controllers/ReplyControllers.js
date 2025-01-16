import Comment from "../models/CommentsModels.js"
import Reply from "../models/ReplyModels.js"
import getMessage from "../utils/getMessage.js"
import {io} from "../../index.js"
export const getCommentsWithReplies = async (req, res) => {
    const lang = req.lang || "en"; 
    try {
      const comments = await Comment.find()
        .populate("userId", "first_name last_name email createdAt")
        .populate("productId", "name price")
        .sort({ createdAt: -1 })
        .lean();
  
      for (let comment of comments) {
        const replies = await Reply.find({ commentId: comment._id })
          .populate("userId", "first_name last_name email userId")
          .sort({ createdAt: -1 });
  
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

    if (!userId) {
      return res.status(400).json({ success: false, message: getMessage(lang, 'error', 'NO_LOGIN') });
    }
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
      io.emit("newReply", newReply);
  
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

  export const deleteReply = async (req, res) => {
    const lang = req.lang || "en"; 
    const replyId = req.params.id;
    const userId = req.user._id; 
  
    try {
      const reply = await Reply.findById(replyId);
      if (!reply) {
        return res.status(404).json({ success: false, message: getMessage(lang, 'error', 'REPLY_NOT_FOUND') });
      }
  
      if (reply.userId.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: getMessage(lang, 'error', 'UNAUTHORIZED_TO_DELETE') });
      }
  
      // Xóa reply
      await Reply.findByIdAndDelete(replyId);
      io.emit("deleteReply", replyId);
  
      return res.status(200).json({ success: true, message: getMessage(lang, 'success', 'REPLY_DELETED_SUCCESS') });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: getMessage(lang, 'error', 'SERVER_ERROR') });
    }
  };
  