import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Button } from "@mui/material";
import ins from "../../api";
import { baseURL } from "../../api";
import Swal from "sweetalert2";
const QLBL = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<any[]>([]);  
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


  const handleDeleteComment = async (commentId: string) => {
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
            <Button variant="contained" color="info" sx={{ marginRight: 1 }} onClick={() => navigate(`/admin/qlbl/details/${comment._id}`)}>
              Chi tiết
            </Button>
            <Button variant="contained" color="error" onClick={() => handleDeleteComment(comment._id)}>
              Xoá
            </Button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
    </div>
  );
};

export default QLBL;
