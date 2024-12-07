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
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const { checkout } = useContext(CartContext);
  const { state: cartState } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const applyDiscount = async (discountCode: string) => {
    try {
      // Gửi yêu cầu đến API để kiểm tra mã giảm giá
      const response = await ins.post("/vouchers/check", { discountCode });
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
          text: `Giảm giá: ${data.discount}%`,
        });

        return data.discount; // Trả về giá trị giảm giá (theo tỷ lệ phần trăm)
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
    const value = await applyDiscount(discountCode);
    setDiscountValue(value);
    if (value > 0) {
      sessionStorage.setItem("discountCode", discountCode);
      sessionStorage.setItem("discountValue", value.toString());
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
      setTotalPrice(cartState.totalPrice);
    }
    if (discountCode && discountValue) {
      setTotalPrice(
        cartState.totalPrice -
          (Number(discountValue) / 100) * cartState.totalPrice
      );
    }
  }, [discountValue]);

  const handleCreatePayment = async () => {
    const checkoutData = {
      discountCode,
    };
    // Hộp thoại xác nhận
    if (paymentMethod === "COD") {
      Swal.fire({
        icon: "success",
        title: "Đặt hàng thành công!",
        text: "Vui lòng chờ xác nhận đơn hàng",
        confirmButtonText: "Ok",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await checkout(checkoutData);
        }
      });
    }
    console.log("Payment method:", totalPrice);
    if (paymentMethod === "CreditCard") {
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
      <h3>Thông tin người dùng</h3>
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
          <h4>Giá trị giảm giá : {discountValue}%</h4>
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
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-primary px-4 py-2"
            onClick={handleCreatePayment}
          >
            Thanh toán
          </button>
          <button
            className="btn btn-danger px-4 py-2"
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
