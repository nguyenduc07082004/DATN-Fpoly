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
  },[])
  const handleCreatePayment = async () => {
    try {
      const response = await ins.post("/vnpay/create_payment_url", {
        orderType: "billpayment",
        amount: totalPrice,
        orderDescription: "Payment for order",
        bankCode: "",
        language: "vn",
        userId:user._id,
        discountCode: discountCode
      });

      window.location.href = response.data.data;
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };
  // const handlePayment = async () => {
  //   if (!token) {
  //     alert("Vui lòng đăng nhập để thanh toán");
  //     navigate("/login");
  //     return;
  //   }

  //   const order = {
  //     userId: userState.user[0]?.id,
  //     products: cartState.products.map((item) => ({
  //       productId: item.product._id,
  //       quantity: item.quantity,
  //     })),
  //     totalPrice: cartState.totalPrice,
  //     status: "Đang chuẩn bị hàng",
  //   };

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/orders/checkout",
  //       order,
  //       {
  //         headers: { Authorization: `Bearer ${token}` }, // Gửi token qua header nếu cần
  //       }
  //     );
  //     if (response.status === 201) {
  //       orderDispatch({ type: "ADD_ORDER", payload: response.data.order });
  //       const clearCartResponse = await axios.delete(
  //         `http://localhost:8000/carts/remove/${userState.user[0]?.id}`
  //       );
  //       if (clearCartResponse.status === 200) {
  //         cartDispatch({ type: "CLEAR_CART" });
  //       }
  //       navigate("/order-success");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi tạo đơn hàng:", error);
  //     alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
  //   }
  // };

  // if (!userState.user) {
  //   return (
  //     <div>
  //       Không có thông tin người dùng. <a href="/login">Đăng nhập</a>
  //     </div>
  //   );
  // }

  // if (!cartState.products || cartState.products.length === 0) {
  //   return <div>Không có sản phẩm trong giỏ hàng</div>;
  // }

  return (
    <div className="container">
      <h1 className="my-4 text-center">Thanh toán qua VNPAY</h1>
      <div className="text-center mb-4">
        <img src={vnpayLogo} alt="VNPAY Logo" style={{ width: "150px" }} />
      </div>
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
        </h3>
      </div>
    </div>
  );
};

export default Vnpay;
