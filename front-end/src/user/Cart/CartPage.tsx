import { useContext, useEffect, useState } from "react";
import { CartContext, CartContextType } from "../../api/contexts/CartContext";
import { CartItem } from "../../api/reducers/CartReducer";
import { useNavigate } from "react-router-dom";
import { FaMinusCircle, FaPlusCircle, FaShoppingCart, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import ins from "../../api";

const Cart = () => {
  const { state, removeFromCart, checkout, addToCart, fetchCart } = useContext(
    CartContext
  ) as CartContextType;
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0); // Giá trị giảm giá (theo tỷ lệ phần trăm)

  useEffect(() => {
    fetchCart();
  }, []);

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
    } catch (error : any) {
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

  const handleRemoveFromCart = (variantId: string) => {
    removeFromCart(variantId);
  };

  const handleDecreaseQuantity = (product: CartItem) => {
    if (product?.quantity > 1) {
      addToCart({
        productId: product.product._id,
        quantity: -1,
        price: product.price,
        variantId: product.variantId,
        selectedColor: product.color,
        selectedStorage: product.storage,
      });
    }
  };

  const handleIncreaseQuantity = (product: CartItem) => {
    addToCart({
      productId: product.product._id,
      quantity: 1,
      price: product.price,
      variantId: product.variantId,
      selectedColor: product.color,
      selectedStorage: product.storage,
    });
  };

  const handleCheckout = async () => {
    try {
      if (!token) {
        alert("Vui lòng đăng nhập để thanh toán");
        navigate("/login");
      } else {
        // Thêm mã giảm giá và giá trị giảm giá vào payload
        const checkoutData = {
          discountCode,   
        };
  
        if (paymentMethod === "CreditCard") {
          // Điều hướng đến thanh toán qua VNPay
          navigate("/vnpay");
        } else {
          // Gửi yêu cầu thanh toán với các thông tin giảm giá
          const res = await checkout(checkoutData);
  
          if (res.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Thanh toán đơn hàng thành công",
              showConfirmButton: true,
              confirmButtonText: "OK",
              timer: 1500,
            }).then(() => {
              sessionStorage.removeItem("discountCode");
              sessionStorage.removeItem("discountValue");
              navigate("/checkout");
            });
          }
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  };
  

  // Tính toán tổng tiền sau khi giảm giá
  const totalAfterDiscount = state.totalPrice - (state.totalPrice * discountValue) / 100;

  return (
    <div className="container">
      <h1>
        <FaShoppingCart className="me-2" />
        Giỏ hàng
      </h1>
      {/* Bảng hiển thị thông tin người dùng */}
      <h2>Thông tin người dùng</h2>
      <table className="table table-hover">
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

      {/* Chọn hình thức thanh toán */}
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

      <table className="table table-hover ">
        <thead>
          <tr className="table-info">
            <th className="col-4">Tên sản phẩm</th>
            <th className="col-3">Màu sắc</th>
            <th className="col-3">Dung lượng</th>
            <th className="col-3">Số lượng</th>
            <th className="col-3">Giá</th>
            <th className="col-1">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {state.products.map((product: CartItem, index: number) => (
            <tr key={index}>
              <td className="row-4">{product.product?.title}</td>
              <td className="row-3">{product.color}</td>
              <td className="row-3">{product.storage}</td>
              <td className="row-3">
                <FaMinusCircle
                  onClick={() => handleDecreaseQuantity(product)}
                  className="text-danger"
                />{" "}
                {product?.quantity}{" "}
                <FaPlusCircle
                  onClick={() => handleIncreaseQuantity(product)}
                  className="text-primary"
                />
              </td>
              <td className="row-4">{(product.price * product.quantity).toLocaleString()}</td>
              <td>
                <FaTrash
                  onClick={() => handleRemoveFromCart(product.variantId)}
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tổng tiền sau khi giảm giá */}
      <div className="row fs-5 my-4">
        <div className="col text-right">
          <strong>Tổng tiền:</strong>
        </div>
        <div className="col text-right fw-bold">
          <span>{state.totalPrice.toLocaleString()} đ</span>
        </div>
      </div>

      {discountValue > 0 && (
        <div className="row fs-5 my-4">
          <div className="col text-right fw-bold">
            <strong>Giảm giá ({discountValue}%):</strong>
          </div>
          <div className="col text-right fw-bold">
            <span>-{((state.totalPrice * discountValue) / 100).toLocaleString()} đ</span>
          </div>
        </div>
      )}

      <div className="row fs-5 my-4">
        <div className="col text-right">
          <strong>Tổng tiền sau giảm giá:</strong>
        </div>
        <div className="col text-right fw-bold">
          <span>{totalAfterDiscount.toLocaleString()} đ</span>
        </div>
      </div>

      <div className="my-4">
        <button onClick={handleCheckout} className="btn btn-success">
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
