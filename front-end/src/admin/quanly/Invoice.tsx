import { useEffect, useState } from "react";
import { baseURL } from "../../api";
import ins from "../../api";
import { Modal, Box, Button, Typography } from "@mui/material";
import PrintInvoiceButton from "../../../template/Print";
const InvoiceList = () => {
  const [invoices, setInvoices] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(10);

  const fetchInvoices = async (page: number) => {
    setLoading(true); 
    try {
      const response = await ins.get(`${baseURL}/invoice`, {
        params: {
          page,
          limit,
        },
      });
      setInvoices(response.data.invoices);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage]);

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  const openModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); // Chuyển sang trang mới
    }
  };

  return (
    <div>
      <h2>Quản lý hoá đơn</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Thanh toán</th>
            <th>Ngày thanh toán</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice: any) => (
            <tr key={invoice._id}>
              <td>{invoice._id}</td>
              <td>
                {invoice.totalAmount.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
              <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
              <td>
                <Button
                  onClick={() => openModal(invoice)}
                  variant="contained"
                  color="info"
                >
                  Xem chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Điều hướng phân trang */}
      <div className="d-flex justify-content-center align-items-center">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="outlined"
        >
          Trước
        </Button>
        <Typography variant="body1" sx={{ margin: "0 10px" }}>
          Trang {currentPage} / {totalPages}
        </Typography>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="outlined"
        >
          Sau
        </Button>
      </div>

      {/* Modal để hiển thị chi tiết hóa đơn */}
      <Modal open={open} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: 24,
            minWidth: "300px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Chi tiết hoá đơn
          </Typography>
          {selectedInvoice && (
            <div>
              <Typography>
                <strong>Mã hoá đơn:</strong> {selectedInvoice._id}
              </Typography>
              <Typography>
                <strong>Thanh toán:</strong>{" "}
                {selectedInvoice.totalAmount.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
              <Typography>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(selectedInvoice.createdAt).toLocaleDateString()}
              </Typography>
              {/* <Typography>
                <strong>Ngày giao hàng:</strong>{" "}
                {selectedInvoice.orderId?.delivered_at &&
                selectedInvoice.orderId?.delivered_at !== null
                  ? new Date(
                      selectedInvoice.orderId.delivered_at
                    ).toLocaleDateString()
                  : "Chưa giao hàng"}
              </Typography> */}

              <Typography variant="subtitle1" sx={{ marginTop: "20px" }}>
                <strong>Danh sách sản phẩm:</strong>
              </Typography>
              <ul>
                {selectedInvoice.orderItems.map((item: any) => (
                  <li key={item._id}>
                    <Typography>
                      <strong>Tên sản phẩm:</strong> {item.productId?.title}
                    </Typography>
                    <Typography>
                      <strong>Mô tả: </strong> {item.productId?.description}
                    </Typography>
                    <Typography>
                      <strong>Số lượng:</strong> {item.quantity}
                    </Typography>
                    <Typography>
                      <strong>Giá tiền:</strong>{" "}
                      {item.price.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Typography>
                    <Typography>
                      <strong>Dung lượng:</strong> {item.storage}
                    </Typography>
                    <Typography>
                      <strong>Màu sắc:</strong> {item.color}
                    </Typography>
                  </li>
                ))}
              </ul>
              <Typography>
                <strong>Tổng tiền:</strong>{" "}
                {(
                  selectedInvoice.totalAmount +
                  (selectedInvoice.orderId?.discount_value || 0)
                ).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
              {selectedInvoice.orderId && selectedInvoice.orderId.voucher && (
                <Typography>
                  <strong>Mã giảm giá:</strong>{" "}
                  {selectedInvoice.orderId.voucher}
                </Typography>
              )}
              {selectedInvoice.orderId &&
                selectedInvoice.orderId.discount_value > 0 && (
                  <Typography>
                    <strong>Giá trị giảm giá:</strong>{" "}
                    {selectedInvoice.orderId?.discount_value?.toLocaleString(
                      "vi-VN",
                      { style: "currency", currency: "VND" }
                    )}
                  </Typography>
                )}

              <Button
                onClick={() => PrintInvoiceButton(selectedInvoice)}
                variant="contained"
                color="primary"
                sx={{ marginTop: "10px" }}
              >
                In Hoá Đơn
              </Button>
              <Button
                onClick={closeModal}
                variant="outlined"
                sx={{ marginLeft: "10px", marginTop: "10px" }}
              >
                Đóng
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default InvoiceList;
