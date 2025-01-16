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
  doc.text("Hoa don", 105, 20, { align: "center" });

  // Invoice details
  doc.setFontSize(12);
  doc.text(`Ma hoa don: ${selectedInvoice._id}`, 10, 30);
  doc.text(`Ngay tao: ${new Date(selectedInvoice.createdAt).toLocaleDateString()}`, 10, 40);
  doc.text(`Ngay thanh toan: ${new Date(selectedInvoice.createdAt).toLocaleDateString()}`, 10, 50);
  doc.text(`tong tien: ${selectedInvoice.totalAmount.toLocaleString("vi", { style: "currency", currency: "VND" })}`, 10, 60);

  // Product details
  doc.text("Chi tiet san pham:", 10, 70);

  // Loop over items and add them to the document
  selectedInvoice.orderItems.forEach((item, index) => {
    const yPosition = 80 + index * 10;
    doc.text(`${item.productId.title} - ${item.storage} - ${item.color}`, 10, yPosition);
    doc.text(`Gia: ${item.price.toLocaleString("vi", { style: "currency", currency: "VND" })}`, 100, yPosition);
    doc.text(`So luong: ${item.quantity}`, 160, yPosition);
  });

  // Total
  doc.text(`Tong tien: ${selectedInvoice.totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`, 10, 130);

  // Discount details (if any)
  if (selectedInvoice.orderId?.voucher) {
    doc.text(`Ma giam gia: ${selectedInvoice.orderId.voucher}`, 10, 110);
  }
  if (selectedInvoice.orderId?.discount_value) {
    doc.text(`Giam gia: ${selectedInvoice.orderId.discount_value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`, 10, 120);
  }

  // Open the PDF in a new window
  doc.output("dataurlnewwindow");
};

export default PrintInvoiceButton;
