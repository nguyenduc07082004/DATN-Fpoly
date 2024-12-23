import React from "react";
import { jsPDF } from "jspdf";
import { Button } from "@mui/material";

interface InvoiceItem {
  productId: { title: string };
  storage: string;
  color: string;
  price: number;
  quantity: number;
}

interface Invoice {
  _id: string;
  createdAt: string;
  totalAmount: number;
  orderItems: InvoiceItem[];
  orderId?: {
    voucher?: string;
    discount_value?: number;
  };
}

const PrintInvoiceButton: React.FC<Invoice> = (props) => {
  const selectedInvoice = props;
  const doc = new jsPDF();

  // Title of the invoice
  doc.setFontSize(18);
  doc.text("Hóa Đơn", 105, 20, { align: "center" });

  // Invoice details
  doc.setFontSize(12);
  doc.text(`Mã Hóa Đơn: ${selectedInvoice._id}`, 10, 30);
  doc.text(`Ngày tạo: ${new Date(selectedInvoice.createdAt).toLocaleDateString()}`, 10, 40);
  doc.text(`Ngày thanh toán: ${new Date(selectedInvoice.createdAt).toLocaleDateString()}`, 10, 50);
  doc.text(`Tổng tiền: ${selectedInvoice.totalAmount.toLocaleString("vi", { style: "currency", currency: "VND" })}`, 10, 60);

  // Product details
  doc.text("Chi tiết sản phẩm:", 10, 70);

  // Loop over items and add them to the document
  selectedInvoice.orderItems.forEach((item, index) => {
    const yPosition = 80 + index * 10;
    doc.text(`${item.productId.title} - ${item.storage} - ${item.color}`, 10, yPosition);
    doc.text(`Giá: ${item.price.toLocaleString("vi", { style: "currency", currency: "VND" })}`, 100, yPosition);
    doc.text(`Số lượng: ${item.quantity}`, 140, yPosition);
    doc.text(`Tổng: ${(item.price * item.quantity).toLocaleString("vi", { style: "currency", currency: "VND" })}`, 180, yPosition);
  });

  // Total
  doc.text(`Tổng tiền: ${selectedInvoice.totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`, 10, 100);

  // Discount details (if any)
  if (selectedInvoice.orderId?.voucher) {
    doc.text(`Mã giảm giá: ${selectedInvoice.orderId.voucher}`, 10, 110);
  }
  if (selectedInvoice.orderId?.discount_value) {
    doc.text(`Giảm giá: ${selectedInvoice.orderId.discount_value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`, 10, 120);
  }

  // Open the PDF in a new window
  doc.output("dataurlnewwindow");
};

export default PrintInvoiceButton;
