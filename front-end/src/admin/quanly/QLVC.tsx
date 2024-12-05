import React, { useState, useEffect } from "react";
import ins from "../../api";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
} from "@mui/material";
import Swal from "sweetalert2";

const VoucherManagement: React.FC = () => {
  const userId = JSON.parse(localStorage.getItem("user") || "{}")._id;
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [code, setCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [message, setMessage] = useState({
    type: "",
    message: "",
  });
  const [editVoucher, setEditVoucher] = useState<any | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Hàm lấy danh sách voucher với tìm kiếm và phân trang
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await ins.get(`/vouchers`, {
          params: {
            page,
            search: searchQuery,
            sortBy: "expiration_date", // Sort by expiration date
            sortOrder: "asc", // Sắp xếp tăng dần
          },
        });
        setVouchers(response.data.vouchers);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchVouchers();
  }, [page, searchQuery]);

  // Hàm tạo voucher mới
  const handleCreateVoucher = async () => {
    try {
      if (!code || !discount || !expirationDate) {
        setMessage({
          type: "warning",
          message: "Vui lòng nhập đầy đủ thông tin",
        });
        return;
      }
      const newVoucher = { code, discount, expiration_date: expirationDate };
      const response = await ins.post("/vouchers", newVoucher);
      setVouchers([...vouchers, response.data]);
      setMessage({ type: "success", message: "Tạo mã giảm giá thành công!" });
      setCode("");
      setDiscount(0);
      setExpirationDate("");
    } catch (error: any) {
      console.log(error);
      setMessage({ type: "error", message: error.response.data.error });
    }
  };

  // Hàm chỉnh sửa voucher
  const handleEditVoucher = async () => {
    if (editVoucher) {
      try {
        const updatedVoucher = {
          ...editVoucher,
          code,
          discount,
          expiration_date: expirationDate,
        };
        const response = await ins.put(
          `/vouchers/${editVoucher._id}`,
          updatedVoucher
        );
        setVouchers((prevVouchers) =>
          prevVouchers.map((voucher) =>
            voucher._id === response.data._id ? response.data : voucher
          )
        );
        setMessage({
          type: "success",
          message: "Cập nhật mã giảm giá thành công!",
        });
        setOpenEditDialog(false);
        setEditVoucher(null); // Clear the edit voucher state
        setCode("");
        setDiscount(0);
        setExpirationDate("");
      } catch (error) {
        setMessage({ type: "error", message: "Lỗi khi cập nhật mã giảm giá" });
      }
    }
  };

  // Hàm xóa voucher
  const handleDeleteVoucher = async (voucherCode: string) => {
    try {
      Swal.fire({
        title: "Xóa mã giảm giá",
        text: "Bạn có muôn xóa mã giảm giá này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await ins.delete(`/vouchers/${voucherCode}`);
          setVouchers(
            vouchers.filter((voucher) => voucher.code !== voucherCode)
          );
          setMessage({ type: "success", message: response.data.message });
        }
      });
    } catch (error) {
      setMessage({ type: "error", message: "Lỗi khi xóa mã giảm giá" });
    }
  };

  // Hàm mở form sửa voucher
  const openEditDialogHandler = (voucher: any) => {
    setEditVoucher(voucher);
    setCode(voucher.code);
    setDiscount(voucher.discount);
    setExpirationDate(voucher.expiration_date);
    setOpenEditDialog(true);
  };

  // Đóng form sửa voucher
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditVoucher(null);
    setCode("");
    setDiscount(0);
    setExpirationDate("");
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

      {/* Form tạo voucher */}
      <Typography variant="h6" gutterBottom>
        Tạo mã mới
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Mã giảm giá"
            variant="outlined"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Giảm giá (%)"
            variant="outlined"
            fullWidth
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Ngày hết hạn"
            variant="outlined"
            fullWidth
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
            InputLabelProps={{
              shrink: true, // Đảm bảo nhãn luôn hiển thị trên cùng
            }}
          />
        </Grid>
      </Grid>
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleCreateVoucher}>
        Tạo mã
      </Button>

      {/* Tìm kiếm voucher */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Tìm kiếm mã giảm giá"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Danh sách voucher */}
      <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
        Danh sách mã giảm giá
      </Typography>
      <Grid container spacing={3}>
        {vouchers.length === 0 ? (
          <Typography variant="body1" gutterBottom>
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
                <CardActions>
                  {/* Nút Sửa */}
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => openEditDialogHandler(voucher)}
                    disabled={voucher.is_used === true}
                  >
                    Sửa
                  </Button>
                  {/* Nút Xóa */}
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDeleteVoucher(voucher.code)}
                  >
                    Xoá
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Phân trang */}
      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
        sx={{ mt: 4 }}
      />

      {/* Dialog để chỉnh sửa voucher */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Voucher</DialogTitle>
        <DialogContent>
          <TextField
            label="Voucher Code"
            fullWidth
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled
          />
          <TextField
            label="Discount"
            fullWidth
            variant="outlined"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
          <TextField
            label="Expiration Date"
            fullWidth
            variant="outlined"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditVoucher}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VoucherManagement;
