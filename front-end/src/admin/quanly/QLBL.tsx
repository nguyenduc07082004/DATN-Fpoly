import { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import ins from "../../api";
import { baseURL } from "../../api";
import Swal from "sweetalert2";
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
      Swal.fire("Thành công", "Trả lời đánh giá thành công", "success");
    } catch (error) {
      console.error("Lỗi khi trả lời bình luận:", error);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi trả lời đánh giá", "error");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    // Hiển thị cửa sổ xác nhận
    const result = await Swal.fire({
      title: 'Bạn chắc chắn muốn xóa đánh giá này?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true
    });
  
    if (result.isConfirmed) {
      try {
        await ins.delete(`${baseURL}/comments/${commentId}`);
        setComments(comments.filter((comment) => comment._id !== commentId));
        Swal.fire("Thành công", "Xóa đánh giá thành công!", "success");
      } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        Swal.fire("Lỗi", "Có lỗi xảy ra khi xóa đánh giá", "error");
      }
    } else {
      Swal.fire('Hủy', 'Hành động xóa đã bị hủy', 'info');
    }
  };
  

  return (
    <div>
      <h2>Đánh giá của khách hàng</h2>
      <table className="table">
  <thead>
    <tr>
      <th>Sản phẩm</th>
      <th>Lời đánh giá</th>
      <th>Ngày đánh giá</th>
      <th>Người đánh giá</th>
      <th>Trả lời</th>
    </tr>
  </thead>
  <tbody>
    {comments.length === 0 ? (
      <tr>
        <td colSpan={5}>Chưa có đánh giá nào</td>
      </tr>
    ) : (
      comments.map((comment) => (
        <tr key={comment._id}>
          <td>{comment.productId?._id}</td> 
          <td>{comment.comment}</td>
          <td>{new Date(comment.createdAt).toLocaleString()}</td>
          <td>{comment.userId?.last_name}</td>
          <td>
            <Button variant="contained" color="info" sx={{ marginRight: 1 }} onClick={() => window.location.href = `/admin/qlbl/details/${comment._id}`}>
              Chi tiết
            </Button>
            {/* <Button variant="contained" sx={{ marginRight: 1 }} onClick={() => openModal(comment)}>
              Trả lời
            </Button> */}
            <Button variant="contained" color="error" onClick={() => handleDeleteComment(comment._id)}>
              Xoá
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
            Trả lời đánh giá cho sản phẩm: {selectedComment?.product_name}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            <strong>Đánh giá:</strong> {selectedComment?.comment}
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
