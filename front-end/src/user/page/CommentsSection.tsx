import React, { useState } from "react";
import { Grid, Box, Typography, TextField, Button, Rating, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CommentsSection = ({ comments, onAddReply, onDeleteReply , userId }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [replyText, setReplyText] = useState({});

  console.log(comments,"dayl à conment")
  const handleReplyChange = (id, value) => {
    setReplyText((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendReply = (commentId) => {
    if (!replyText[commentId]?.trim()) return;
    onAddReply(commentId, replyText[commentId]);
    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
  };

  const handleDeleteReply = (commentId, replyId) => {
    onDeleteReply(commentId, replyId);
  };

  return (
    <Grid item xs={12}>
      <Box sx={{ padding: 3, border: "1px solid #ddd", borderRadius: 2, backgroundColor: "#f9f9f9" }}>
      {comments.length > 0 ? (
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          Đánh giá:
        </Typography>
      ) : (
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
         Chưa có đánh giá cho sản phẩm này
        </Typography>
      )}
        {comments.length > 0 &&
          comments.map((comment: any) => (
            <Box
              key={comment.id}
              sx={{
                marginBottom: 3,
                padding: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "#fff",
                boxShadow: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "#00796b" }}>
                Người đánh giá: {comment.userId.email}
              </Typography>
              <Rating value={comment.rating} readOnly size="small" sx={{ marginBottom: 1 }} />
              <Typography variant="body2" sx={{ marginBottom: 1, fontStyle: "italic" }}>
                Thời gian đánh giá: {new Date(comment.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1, fontStyle: "italic" }}>
                Nội dung: {comment.comment}
              </Typography>

              {comment.replies.map((reply:any, idx:number) => (
                <Box
                  key={idx}
                  sx={{
                    marginLeft: 2,
                    marginTop: 1,
                    position: "relative",
                    padding: 1,
                    backgroundColor: "#f1f1f1",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "#00796b" }}>
                    Người bình luận: {reply.userId.first_name} {reply.userId.last_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555", marginBottom: 1 }}>
                    Thời gian bình luận: {new Date(reply.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555", marginBottom: 1 }}>
                    Nội dung: {reply.reply}
                  </Typography>
                  <IconButton
                    onClick={() => handleDeleteReply(comment._id, reply._id)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      color: "#e57373", 
                    }}
                  >
                    {console.log(reply.userId._id , userId)}
                    {(reply.userId._id == userId || user.role == "admin") && <CloseIcon />}
                    </IconButton>
                </Box>
              ))}

              <Box sx={{ marginTop: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Viết phản hồi của bạn..."
                  sx={{
                    marginBottom: 1,
                    backgroundColor: "#fafafa", 
                    borderRadius: 1,
                  }}
                  value={replyText[comment._id] || ""}
                  onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSendReply(comment._id)}
                  disabled={!replyText[comment._id]?.trim()}
                  sx={{
                    textTransform: "none", 
                    boxShadow: 2,
                    '&:hover': {
                      backgroundColor: "#00796b", 
                    },
                  }}
                >
                  Gửi phản hồi
                </Button>
              </Box>
            </Box>
          ))}
      </Box>
    </Grid>
  );
};

export default CommentsSection;
