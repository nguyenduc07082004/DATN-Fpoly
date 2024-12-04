import { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import ins from "../../api";
import { baseURL } from "../../api";
const QLBL = () => {
  const [comments, setComments] = useState<any[]>([]);  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [selectedComment, setSelectedComment] = useState<any>(null); 
  const [reply, setReply] = useState("");  
  const userId = JSON.parse(localStorage.getItem("user") ?? "{}")?._id ?? "";
  useEffect(() => {
    const fetchComments = async () => {
      try {

        const response = await ins.get(`${baseURL}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      }
    };
    

    fetchComments();
  }, []);

  const openModal = (comment: any) => {
    setSelectedComment(comment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReply("");  
  };

  const handleReplySubmit = async (e: any) => {
    e.preventDefault();
    try {
    const response = await ins.post(`${baseURL}/replies/${selectedComment._id}`, { reply , userId: userId });
      setComments(comments.map((comment) =>
        comment._id === selectedComment._id ? { ...comment, reply: response.data.reply } : comment
      ));
      closeModal();
      alert("Trả lời thành công!");
    } catch (error) {
      console.error("Lỗi khi trả lời bình luận:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h2>Bình luận của khách hàng</h2>
      <table className="table">
  <thead>
    <tr>
      <th>Sản phẩm bình lua</th>
      <th>Bình luận</th>
      <th>Ngày bình luận</th>
      <th>Người bình luận</th>
      <th>Trả lời</th>
    </tr>
  </thead>
  <tbody>
    {comments.length === 0 ? (
      <tr>
        <td colSpan={5}>Chưa có bình luận nào</td>
      </tr>
    ) : (
      comments.map((comment) => (
        <tr key={comment._id}>
          <td>{comment.productId?._id}</td> 
          <td>{comment.comment}</td>
          <td>{new Date(comment.createdAt).toLocaleString()}</td>
          <td>{comment.userId?.last_name}</td>
          <td>
            <Button variant="outlined" onClick={() => openModal(comment)}>
              Trả lời
            </Button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 3,
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Trả lời bình luận cho sản phẩm: {selectedComment?.product_name}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            <strong>Bình luận:</strong> {selectedComment?.comment}
          </Typography>

          <form onSubmit={handleReplySubmit} style={{ marginTop: 16 }}>
            <TextField
              fullWidth
              id="reply"
              label="Trả lời"
              multiline
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              required
              sx={{ marginBottom: 2 }}
            />
            <div style={{ textAlign: "right" }}>
              <Button type="submit" variant="contained" color="primary">
                Gửi trả lời
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default QLBL;
