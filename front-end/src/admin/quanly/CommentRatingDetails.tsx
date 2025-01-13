import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, TextField, CircularProgress, IconButton } from "@mui/material";
import ins from "../../api";
import { baseURL } from "../../api";
import Swal from "sweetalert2";
import io from "socket.io-client";

const CommentRatingDetails = () => {
  const { commentId } = useParams<{ commentId: string }>();
  const [commentDetails, setCommentDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const socket = io(baseURL);

  const userId = JSON.parse(localStorage.getItem("user") ?? "{}")?._id ?? "";

  const fetchCommentDetails = async () => {
    try {
      const response = await ins.get(`${baseURL}/comments/detail/${commentId}`);
      setCommentDetails(response.data.data);
    } catch (error) {
      Swal.fire("Lỗi", "Không thể tải chi tiết bình luận", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentDetails();

    const handleNewReply = () => {
      fetchCommentDetails(); 
    };

    socket.on("newReply", handleNewReply);
    socket.on("deleteReply" , handleNewReply);

    return () => {
      socket.off("newReply", handleNewReply);
      socket.off("deleteReply", handleNewReply);
    };
  }, [commentId]);

  const handleDeleteReply = async (replyId: string) => {
    try {
      const confirm = await Swal.fire({
        title: "Xóa trả lời?",
        text: "Bạn có chắc muốn xóa trả lời này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (confirm.isConfirmed) {
        await ins.delete(`${baseURL}/replies/${replyId}`);
        await fetchCommentDetails();
        Swal.fire("Đã xóa!", "Trả lời đã được xóa.", "success");
      }
    } catch (error) {
      Swal.fire("Lỗi", "Không thể xóa trả lời", "error");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography>Đang tải chi tiết bình luận...</Typography>
      </Box>
    );
  }

  if (!commentDetails) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6" color="error">
          Không tìm thấy chi tiết bình luận.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Chi tiết đánh giá
      </Typography>
      <Box sx={{ marginBottom: 3, border: "1px solid #ccc", borderRadius: 2, padding: 2 }}>
        <Typography variant="h6">Đánh giá:</Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          {commentDetails.comment}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Ngày: {new Date(commentDetails.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Người đánh giá: {commentDetails.userId?.first_name} {commentDetails.userId?.last_name}
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Bình luận:</Typography>
        {commentDetails.replies?.length > 0 ? (
          commentDetails.replies.map((reply: any, index: number) => (
            <Box
              key={reply._id || index}
              sx={{
                marginBottom: 2,
                border: "1px solid #eee",
                borderRadius: 2,
                padding: 2,
                position: "relative",
              }}
            >
              <IconButton
                onClick={() => handleDeleteReply(reply._id)}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 8,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "red", 
                    fontSize: "1.2rem", 
                    cursor: "pointer", 
                  }}
                >
                  x
                </Typography>
              </IconButton>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {reply.userId?.first_name} {reply.userId?.last_name}:
              </Typography>
              <Typography variant="body2">Nội dung: {reply.reply}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                Ngày: {new Date(reply.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>Chưa có bình luận nào cho đánh giá này.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default CommentRatingDetails;
