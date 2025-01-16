import React, { useState, useEffect } from "react";
import ins from "../../api";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  Pagination, // Thêm Pagination
} from "@mui/material";
import io from "socket.io-client";
import { baseURL } from "../../api";
const Voucher: React.FC = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [message, setMessage] = useState({ type: "", message: "" });
  const [page, setPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const socket = io(baseURL);
  // Hàm lấy danh sách voucher với phân trang
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await ins.get("/vouchers/user", {
          params: { page, limit: 6 }, // Truyền page và limit vào API call
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
    socket.on("new_voucher", (data) => {
      fetchVouchers();
    })
    return () => {
      socket.off("new_voucher");
    }
  }, [page]); // Mỗi khi page thay đổi, gọi lại API

  // Hàm xử lý thay đổi trang
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); // Cập nhật trang mới
  };

  // Hàm sao chép mã giảm giá
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code); // Sao chép mã vào clipboard
      setMessage({ type: "success", message: "Sao chép mã thành công!" });
    } catch (error) {
      console.error("Error copying code:", error);
      setMessage({ type: "error", message: "Không thể sao chép mã." });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <div
        className="container-fluid rounded shadow-sm my-4 p-4"
        style={{ backgroundColor: "#eaeaea" }}
      >
        <Typography variant="h4" gutterBottom>
          Mã giảm giá
        </Typography>

        {/* Thông báo */}
        {message && message.type && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.message}
          </Alert>
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
                      Giá trị tối thiểu: {voucher.min_order_value.toLocaleString("vi-VN")} VND
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Giá trị tối đa: {voucher.max_discount_amount.toLocaleString("vi-VN")} VND
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ngày hết hạn:{" "}
                      {new Date(voucher.expiration_date).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body2"
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
                      style={{
                        color: voucher.is_used ? "red" : "green",
                      }}
                    >
                      Tình trạng: {voucher.is_used ? "Đã sử dụng" : "Chưa sử dụng"}
                    </Typography>
                    {/* Nút sao chép */}
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleCopyCode(voucher.code)}
                      sx={{ mt: 2 }}
                    >
                      Sao chép mã
                    </Button>
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
      </div>
    </Container>
  );
};

export default Voucher;
