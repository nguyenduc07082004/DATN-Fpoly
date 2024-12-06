import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../api/contexts/UserContext";
import { CartContext } from "../../api/contexts/CartContext";
import { OrderContext } from "../../api/contexts/OrdersContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import vnpayLogo from "../../assets/vnpay.jpg";
import ins from "../../api";
import { AuthContext } from "../../api/contexts/AuthContext";

const Vnpay = () => {
  const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
  const discountCode = sessionStorage.getItem("discountCode") || "";
  const discountValue = sessionStorage.getItem("discountValue") || "";
  const { checkout } = useContext(CartContext);
  const { state: cartState } = useContext(CartContext);
  const {user } = useContext(AuthContext);
  // const { dispatch: orderDispatch } = useContext(OrderContext);
  const navigate = useNavigate();
  const [paymentUrl, setPaymentUrl] = useState("");
  const [totalPrice , setTotalPrice] = useState(0);
  // Kiểm tra nếu không có token, yêu cầu người dùng đăng nhập
  if (!token) {
    alert("Vui lòng đăng nhập để thanh toán");
    navigate("/login");
  }

  useEffect(() => {
    if (cartState.totalPrice) {
      setTotalPrice(cartState.totalPrice);
    }
    if (discountCode && discountValue) {
      setTotalPrice(
        cartState.totalPrice - (Number(discountValue) / 100) * cartState.totalPrice
      );
    }
  },[]);
  const handleCreatePayment = async () => {
    // Hộp thoại xác nhận
    const isConfirmed = window.confirm("Bạn có chắc muốn thanh toán? nếu bạn thanh toán bạn buộc phải thanh toán nếu bạn hủy trong giai đoạn thanh toán đơn sẽ được chuyển tự động đưa về phương thức COD");
    if (!isConfirmed) {
      return; // Nếu người dùng không đồng ý, kết thúc hàm
    }
  
    try {
      const response = await ins.post("/vnpay/create_payment_url", {
        orderType: "billpayment",
        amount: totalPrice,
        orderDescription: "Payment for order",
        bankCode: "",
        language: "vn",
        userId: user._id,
        discountCode: discountCode,
      });
  
      // Chuyển hướng đến URL thanh toán
      window.location.href = response.data.data;
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };
  const handleDeadPayment = async () => {
    // Hộp thoại xác nhận
    const isConfirmed = window.confirm("Bạn có chắc muốn hủy đơn? ");
  if (!isConfirmed) {
    return; // Nếu người dùng không đồng ý, kết thúc hàm
  }
  navigate("/cart");
  };

  return (
    <div className="container">
      <h1 className="my-4 text-center">Thanh toán</h1>
      <h3>Thông tin người dùng</h3>
      <table className="mb-4 table table-bordered">
        <tbody>
          <tr>
            <th>Tên:</th>
            <td>{JSON.parse(localStorage.getItem("user") || "{}").first_name + " " + JSON.parse(localStorage.getItem("user") || "{}").last_name}</td>
          </tr>
          <tr>
            <th>Địa chỉ:</th>
            <td>{JSON.parse(localStorage.getItem("user") || "{}").address}</td>
          </tr>
          <tr>
            <th>Số điện thoại:</th>
            <td>{JSON.parse(localStorage.getItem("user") || "{}").phone}</td>
          </tr>
        </tbody>
      </table>
      <h3>Thông tin giỏ hàng</h3>
      <table className="mb-4 table table-bordered">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Tổng giá</th>
          </tr>
        </thead>
        <tbody>
          {cartState.products.map((item) => (
            <tr key={item.product._id}>
              <td>{item.product.title}</td>
              <td>{item.quantity}</td>
              <td>{item.price.toLocaleString("vi" , { style: "currency", currency: "VND" })}</td>
              <td>{(item.price * item.quantity).toLocaleString("vi" , { style: "currency", currency: "VND" })}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {discountCode && discountValue && (
        <div>
          <h4>Mã giảm giá: {discountCode}</h4>
          <h4>Giá trị giảm giá : {discountValue}%</h4>
        </div>
      )}
      <h4>Tổng giá trị giỏ hàng: {totalPrice.toLocaleString("vi" , { style: "currency", currency: "VND" })}</h4>

      <div className="my-4 text-center">
        <h3>
          <button onClick={handleCreatePayment}>Thanh toán</button>

          <button onClick={handleDeadPayment} >Hủy Thanh toán</button>
        </h3>
      </div>
    </div>
  );
};

export default Vnpay;
