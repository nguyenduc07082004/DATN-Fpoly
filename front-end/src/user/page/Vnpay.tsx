import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../api/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import ins from "../../api";
import { AuthContext } from "../../api/contexts/AuthContext";
import Swal from "sweetalert2";

const Vnpay = () => {
  const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0); // Giá trị giảm giá (theo tỷ lệ phần trăm)
  const [discountAmount , setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const { checkout } = useContext(CartContext);
  const { state: cartState } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const applyDiscount = async (discountCode: string) => {
    try {
      // Gửi yêu cầu đến API để kiểm tra mã giảm giá
      const response = await ins.post("/vouchers/check", { discountCode, orderValue: cartState.totalPrice });
      const data = response.data;
      if (response.status === 200) {
        if (data.is_used) {
          // Nếu voucher đã được sử dụng
          Swal.fire({
            icon: "error",
            title: "Mã giảm giá đã được sử dụng",
            text: "Mã giảm giá này đã được sử dụng trước đó.",
          });
          return 0; // Trả về giá trị 0 nếu voucher đã sử dụng
        }

        if (new Date(data.expiration_date) < new Date()) {
          // Nếu voucher đã hết hạn
          Swal.fire({
            icon: "error",
            title: "Mã giảm giá đã hết hạn",
            text: "Mã giảm giá này đã hết hạn sử dụng.",
          });
          return 0; // Trả về giá trị 0 nếu voucher hết hạn
        }

        // Nếu mã giảm giá hợp lệ, hiển thị thông báo thành công
        Swal.fire({
          icon: "success",
          title: "Mã giảm giá áp dụng thành công!",
          text: `Giảm giá: ${data.discount}% , Tối đa giảm giá: ${data.discountAmount.toLocaleString("vi-VN")} VND`,
        });

        return {
          discount: data.discount,
          discountAmount: data.discountAmount,
        }; // Trả về giá trị giảm giá (theo tỷ lệ phần trăm)
      } else {
        // Nếu mã giảm giá không hợp lệ
        Swal.fire({
          icon: "error",
          title: "Mã giảm giá không hợp lệ",
          text: data.message || "Không tìm thấy mã giảm giá này.",
        });
        return 0; // Nếu không hợp lệ, trả về giá trị 0
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra",
        text: error.response.data.error,
      });
      return 0;
    }
  };

  const handleApplyDiscount = async () => {
    const data = await applyDiscount(discountCode);
    if (data) { 
    setDiscountValue(data.discount);
    setDiscountAmount(data.discountAmount);
    }
  };


  // const { dispatch: orderDispatch } = useContext(OrderContext);
  const navigate = useNavigate();
  const [paymentUrl, setPaymentUrl] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  // Kiểm tra nếu không có token, yêu cầu người dùng đăng nhập
  if (!token) {
    alert("Vui lòng đăng nhập để thanh toán");
    navigate("/login");
  }

  useEffect(() => {
    if (cartState.totalPrice) {
      let finalPrice = cartState.totalPrice;
  
      // Tính toán giảm giá theo tỷ lệ phần trăm
      const discountAmountByPercent = (Number(discountValue) / 100) * cartState.totalPrice;
  
      // Kiểm tra nếu giá trị giảm giá theo tỷ lệ phần trăm lớn hơn discountAmount
      const discountToApply = discountAmountByPercent > discountAmount ? discountAmount : discountAmountByPercent;
  
      // Cập nhật tổng giá trị sau khi áp dụng giảm giá
      finalPrice = cartState.totalPrice - discountToApply;
  
      setTotalPrice(finalPrice);
    }
  }, [discountValue, discountAmount, cartState.totalPrice]);

  const handleCreatePayment = async () => {
    const checkoutData = {
      discountCode,
    };
  
    try {
      if (paymentMethod === "COD") {
        const response = await checkout(checkoutData);
  
        if (response.status === 201) {
          const responseData = response.data; 
          Swal.fire({
            icon: "success",
            title: "Đặt hàng thành công!",
            text: responseData.message || "Đơn hàng đã được đặt thành công!",
          });
          setTotalPrice(0);
          setDiscountCode("");
          setDiscountValue(0);
          setDiscountAmount(0);
          navigate("/checkout");
        } else {
          Swal.fire({
            icon: "error",
            title: "Có lỗi xảy ra",
            text: response.data.error || "Không thể xử lý đơn hàng.",
          });
        }
      }
  
      if (paymentMethod === "CreditCard") {
        const response = await ins.post("/vnpay/create_payment_url", {
          orderType: "billpayment",
          amount: totalPrice,
          orderDescription: "Payment for order",
          bankCode: "",
          language: "vn",
          userId: user._id,
          discountCode: discountCode,
        });
  
        if (response.status === 200) {
          const paymentUrl = response.data.data;
          Swal.fire({
            icon: "success",
            title: "Tạo thanh toán thành công!",
            text: "Đang chuyển hướng đến trang thanh toán...",
          });
  
          window.location.href = paymentUrl;
        } else {
          Swal.fire({
            icon: "error",
            title: "Có lỗi xảy ra",
            text: response.data.error || "Không thể tạo thanh toán.",
          });
        }
      }
    } catch (error : any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi hệ thống",
        text: error.response.data.message || "Đã xảy ra lỗi không xác định.",
      });
    }
  };
  
  const handleDeadPayment = async () => {
    const isConfirmed = window.confirm("Bạn có chắc muốn hủy đơn? ");
    if (!isConfirmed) {
      return; 
    }
    navigate("/cart");
  };

  return (
    <div className="container">
      {/* <h3>Thông tin người dùng</h3>
      <table className="mb-4 table table-bordered">
        <tbody>
          <tr>
            <th>Tên:</th>
            <td>
              {JSON.parse(localStorage.getItem("user") || "{}").first_name +
                " " +
                JSON.parse(localStorage.getItem("user") || "{}").last_name}
            </td>
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
      </table> */}
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
              <td>
                {item.price.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
              <td>
                {(item.price * item.quantity).toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-3">
        <label htmlFor="discountCode" className="form-label">
          Nhập mã giảm giá:
        </label>
        <div className="input-group">
          <input
            type="text"
            id="discountCode"
            className="form-control"
            placeholder="Nhập mã giảm giá"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleApplyDiscount}
          >
            Áp dụng
          </button>
        </div>
      </div>
      {discountCode && discountValue !== 0 && (
  <div>
    <h4>Mã giảm giá: {discountCode}</h4>
    <h4>
  Giảm giá:{" "}
  {Math.min((discountValue / 100) * cartState.totalPrice, discountAmount).toLocaleString("vi", {
    style: "currency",
    currency: "VND",
  })}
</h4> 
<div><h4>Tổng giá trị đơn hàng ban đầu: <span>{cartState.totalPrice.toLocaleString ("vi",{
    style: "currency",
    currency: "VND",
  })}</span> </h4></div> 
</div>
)}

      <h4>
        Tổng giá trị giỏ hàng:{" "}
        {totalPrice.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        })}
      </h4>

      <h2>Phương thức thanh toán</h2>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="mb-3 form-select"
      >
        <option value="COD">Thanh toán khi nhận hàng </option>
        <option value="CreditCard">Thanh toán qua vnpay</option>
      </select>
      <p className="text-muted">
        * Vui lòng chọn phương thức thanh toán phù hợp với bạn.
      </p>

      {/* Nhập mã giảm giá */}

      <div className="my-4 text-center">
        <div className="gap-3 d-flex justify-content-center">
          <button
            className="py-2 px-4 btn btn-primary"
            onClick={handleCreatePayment}
          >
            Thanh toán
          </button>
          <button
            className="py-2 px-4 btn btn-danger"
            onClick={handleDeadPayment}
          >
            Hủy Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vnpay;
