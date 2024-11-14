import React, { useContext, useState } from "react";
import { UserContext } from "../../api/contexts/UserContext";
import { CartContext } from "../../api/contexts/CartContext";
import { OrderContext } from "../../api/contexts/OrdersContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import vnpayLogo from "../../assets/vnpay.jpg"; 

const Vnpay = () => {
  const { state: userState } = useContext(UserContext);
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { dispatch: orderDispatch } = useContext(OrderContext);
  const navigate = useNavigate();
  const [paymentUrl, setPaymentUrl] = useState("");

  const handleCreatePayment = async () => {
    try {
      const response = await axios.get("http://localhost:8000/create_payment_url", {
        params: {
          amount: cartState.totalPrice,
        },
      });

      if (response.data) {
        setPaymentUrl(response.data);  // Lưu URL thanh toán để tạo mã QR
      }
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán:", error);
      alert("Có lỗi xảy ra khi tạo URL thanh toán.");
    }
  };

  const handlePayment = async () => {
    const order = {
      userId: userState.user[0]?.id,
      products: cartState.products.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      })),
      totalPrice: cartState.totalPrice,
      status: "Đang chuẩn bị hàng", 
    };

    try {
      const response = await axios.post("http://localhost:8000/orders/checkout", order);
      if (response.status === 201) {
        orderDispatch({ type: "ADD_ORDER", payload: response.data.order });
        const clearCartResponse = await axios.delete(`http://localhost:8000/carts/${userState.user[0]?.id}`);
        if (clearCartResponse.status === 200) {
          cartDispatch({ type: "CLEAR_CART" });
        }
        navigate("/order-success");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
    }
  };

  if (!userState.user) {
    return <div>Không có thông tin người dùng. <a href="/login">Đăng nhập</a></div>;
  }

  if (!cartState.products || cartState.products.length === 0) {
    return <div>Không có sản phẩm trong giỏ hàng</div>;
  }

  return (
    <div className="container">
      <h1 className="my-4 text-center">Thanh toán qua VNPAY</h1>
      <div className="text-center mb-4">
        <img src={vnpayLogo} alt="VNPAY Logo" style={{ width: '150px' }} />
      </div>
      <h3>Thông tin người dùng</h3>
      <table className="mb-4 table table-bordered">
        <tbody>
          <tr><th>Tên:</th><td>{userState.user[0]?.fullName}</td></tr>
          <tr><th>Địa chỉ:</th><td>{userState.user[0]?.address}</td></tr>
          <tr><th>Số điện thoại:</th><td>{userState.user[0]?.phone}</td></tr>
        </tbody>
      </table>
      <h3>Thông tin giỏ hàng</h3>
      <table className="mb-4 table table-bordered">
        <thead>
          <tr><th>Sản phẩm</th><th>Số lượng</th><th>Giá</th><th>Tổng giá</th></tr>
        </thead>
        <tbody>
          {cartState.products.map((item) => (
            <tr key={item.product._id}>
              <td>{item.product.title}</td>
              <td>{item.quantity}</td>
              <td>{item.product.price}</td>
              <td>{item.product.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Tổng giá trị giỏ hàng: {cartState.totalPrice} VND</h4>

      <div className="my-4 text-center">
        <h3>Mã QR thanh toán</h3>
        {paymentUrl ? (
          <QRCodeSVG value={paymentUrl} size={256} />
        ) : (
          <button onClick={handleCreatePayment} className="btn btn-primary btn-lg">
            Tạo mã QR thanh toán
          </button>
        )}
      </div>

      <div className="mt-4 text-center">
        <button onClick={handlePayment} className="btn btn-success btn-lg">
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  );
};

export default Vnpay;
