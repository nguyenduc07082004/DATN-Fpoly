import React, { useState, useEffect } from "react";
import ins from "../../api";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Pagination, // Thêm Pagination
} from "@mui/material";

const Voucher: React.FC = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [message, setMessage] = useState({ type: "", message: "" });
  const [page, setPage] = useState(1);  // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1);  // Tổng số trang

  // Hàm lấy danh sách voucher với phân trang
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await ins.get("/vouchers/user", {
          params: { page, limit: 6 },  // Truyền page và limit vào API call
        });
        setVouchers(response.data.vouchers);
        setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        setMessage({
          type: "error",
          message: "Lỗi khi tải dữ liệu mã giảm giá.",
        });
      }
    };
    fetchVouchers();
  }, [page]);  // Mỗi khi page thay đổi, gọi lại API

  // Hàm xử lý thay đổi trang
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);  // Cập nhật trang mới
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Mã giảm giá
      </Typography>

      {/* Thông báo */}
      {message && message.type && (
        <Alert severity={message.type}>{message.message}</Alert>
      )}

      {/* Danh sách voucher */}
      <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
        Danh sách mã giảm giá
      </Typography>
      <Grid container spacing={3}>
        {vouchers.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 5, ml: 5 }} gutterBottom>
            Chưa có mã giảm giá
          </Typography>
        ) : (
          vouchers.map((voucher) => (
            <Grid item xs={12} sm={6} md={4} key={voucher._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{voucher.code}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Giảm giá: {voucher.discount}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Giá trị tối thiểu: {voucher.min_order_value.toLocaleString('vi-VN')} VND
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Giá trị tối đa: {voucher.max_discount_amount.toLocaleString('vi-VN')} VND
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Ngày hết hạn:{" "}
                    {new Date(voucher.expiration_date).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{
                      color:
                        new Date(voucher.expiration_date).getTime() <
                        new Date().getTime()
                          ? "red"
                          : "green",
                    }}
                  >
                    {new Date(voucher.expiration_date).getTime() <
                    new Date().getTime()
                      ? "Voucher đã hết hạn"
                      : "Voucher còn hạn"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{
                      color: voucher.is_used ? "red" : "green", // Đỏ nếu đã sử dụng, Xanh nếu chưa sử dụng
                    }}
                  >
                    Tình trạng:{" "}
                    {voucher.is_used ? "Đã sử dụng" : "Chưa sử dụng"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default Voucher;
