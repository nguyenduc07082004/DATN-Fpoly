import { useContext, useEffect, useState } from "react";
import { CartContext, CartContextType } from "../../api/contexts/CartContext";
import { CartItem } from "../../api/reducers/CartReducer";
import { useNavigate } from "react-router-dom";
import { FaMinusCircle, FaPlusCircle, FaShoppingCart, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const Cart = () => {
  const { state, removeFromCart, checkout, addToCart, fetchCart } = useContext(
    CartContext
  ) as CartContextType;
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    fetchCart();
  }, []);

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
        if (paymentMethod === "CreditCard") {
          navigate("/vnpay");
        } else {
          const res = await checkout();
          if (res.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Thanh toán đơn hàng thành công",
              showConfirmButton: true,
              confirmButtonText: "OK",
              timer: 1500,
            }).then(() => {
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
          />
          <button className="btn btn-primary" type="button">
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
              <td className="row-2">
                {product.price.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
              <td>
              <FaTrash
                  onClick={() =>
                    handleRemoveFromCart(String(product.variantId))
                  }
                  className="cursor-pointer text-danger"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="table-success">
        <th colSpan={7}>Tổng tiền</th>
        <td>
          <h3>
            {" "}
            {state.totalPrice.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </h3>
        </td>
        <td>
          <button onClick={handleCheckout} className="btn btn-success">
            Thanh toán
          </button>
        </td>
      </table>
    </div>
  );
};

export default Cart;
