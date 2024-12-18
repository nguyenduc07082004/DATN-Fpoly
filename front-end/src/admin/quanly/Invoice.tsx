import { useEffect, useState } from "react";
import { baseURL } from "../../api";
import ins from "../../api";
import { Modal, Box, Button, Typography } from "@mui/material"; 
import { jsPDF } from "jspdf";   

const InvoiceList = () => {
  const [invoices, setInvoices] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null); 
  const [open, setOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState<number>(1); // Tổng số trang
  const [limit] = useState<number>(10); // Số hóa đơn mỗi trang

  // Hàm lấy danh sách hóa đơn với phân trang
  const fetchInvoices = async (page: number) => {
    setLoading(true); // Bắt đầu load dữ liệu
    try {
      const response = await ins.get(`${baseURL}/invoice`, {
        params: {
          page,   // Trang hiện tại
          limit,  // Số lượng hóa đơn mỗi trang
        },
      });
      setInvoices(response.data.invoices);
      setTotalPages(response.data.totalPages); // Giả sử server trả về tổng số trang
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(currentPage); // Gọi API với trang hiện tại khi component mount
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

  const notoSansFontBase64 = import.meta.env.ROBOTO_FONT; 

  const printInvoice = () => {
    if (selectedInvoice) {
      const doc = new jsPDF();

      // Thêm font vào PDF
      doc.addFileToVFS("NotoSans-Regular.ttf", notoSansFontBase64); // Thêm font Noto Sans vào PDF
      doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal"); // Đặt tên font là NotoSans
      doc.setFont("NotoSans"); // Sử dụng font Noto Sans cho văn bản

      // Cấu hình văn bản
      doc.setFontSize(12); // Kích thước chữ

      doc.text(`Invoice ID: ${selectedInvoice._id}`, 10, 10);
      doc.text(`Order ID: ${selectedInvoice.orderId}`, 10, 20);
      doc.text(`Tổng tiền: ${selectedInvoice.totalAmount.toLocaleString("vi", { style: "currency", currency: "VND" })}`, 10, 30);
      doc.text(`Ngày tạo: ${new Date(selectedInvoice.createdAt).toLocaleDateString()}`, 10, 40);

      let yPosition = 50; 
      selectedInvoice.orderItems.forEach((item, index) => {
        doc.text(`Sản phẩm ${index + 1}:`, 10, yPosition);
        doc.text(`Product ID: ${item.productId}`, 10, yPosition + 10);
        doc.text(`Variant ID: ${item.variantId}`, 10, yPosition + 20);
        doc.text(`Dung lượng: ${item.storage}`, 10, yPosition + 30);
        doc.text(`Màu sắc: ${item.color}`, 10, yPosition + 40);
        doc.text(`Số lượng: ${item.quantity}`, 10, yPosition + 50);
        doc.text(`Giá: ${item.price.toLocaleString("vi", { style: "currency", currency: "VND" })}`, 10, yPosition + 60);
        yPosition += 70;
      });

      doc.save(`invoice_${selectedInvoice._id}.pdf`);
    }
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
            <th>Tổng tiền</th>
            <th>Ngày thanh toán</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice: any) => (
            <tr key={invoice._id}>
              <td>{invoice.orderId}</td>
              <td>{invoice.totalAmount.toLocaleString("vi", { style: "currency", currency: "VND" })}</td>
              <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
              <td>
                <Button onClick={() => openModal(invoice)} variant="contained" color="info">
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
              <Typography><strong>ID:</strong> {selectedInvoice._id}</Typography>
              <Typography><strong>Order ID:</strong> {selectedInvoice.orderId}</Typography>
              <Typography><strong>Tổng tiền:</strong> {selectedInvoice.totalAmount.toLocaleString("vi", { style: "currency", currency: "VND" })}</Typography>
              <Typography><strong>Ngày tạo:</strong> {new Date(selectedInvoice.createdAt).toLocaleDateString()}</Typography>

              <Typography variant="subtitle1" sx={{ marginTop: "20px" }}>
                <strong>Order Items:</strong>
              </Typography>

              {/* Duyệt qua orderItems để hiển thị thông tin */}
              <ul>
                {selectedInvoice.orderItems.map((item: any) => (
                  <li key={item._id}>
                    <Typography><strong>Product ID:</strong> {item.productId}</Typography>
                    <Typography><strong>Variant ID:</strong> {item.variantId}</Typography>
                    <Typography><strong>Số lượng:</strong> {item.quantity}</Typography>
                    <Typography><strong>Giá tiền:</strong> {item.price.toLocaleString("vi", { style: "currency", currency: "VND" })}</Typography>
                    <Typography><strong>Dung lượng:</strong> {item.storage}</Typography>
                    <Typography><strong>Màu sắc:</strong> {item.color}</Typography>
                  </li>
                ))}
              </ul>

              <Button onClick={printInvoice} variant="contained" color="primary" sx={{ marginTop: "10px" }}>
                In Hoá Đơn
              </Button>
              <Button onClick={closeModal} variant="outlined" sx={{ marginLeft: "10px", marginTop: "10px" }}>
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
