import React, { useContext, useEffect, useState } from "react";
import { CartContext, CartContextType } from "../../api/contexts/CartContext";
import { CartItem } from "../../api/reducers/CartReducer";
import { useNavigate } from "react-router-dom";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

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

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };

  const handleDecreaseQuantity = (product: any) => {
    if (product?.quantity > 1) {
      addToCart(product.product, -1);
    } else {
      handleRemoveFromCart(String(product.product?._id));
    }
  };

  const handleIncreaseQuantity = (product: any) => {
    addToCart(product.product, +1);
  };

  const handleCheckout = async () => {
    if (!token) {
      alert("Vui lòng đăng nhập để thanh toán");
      navigate("/login");
    } else {
      alert(`Thanh toán thành công với phương thức: ${paymentMethod}`);
      await checkout();
      navigate("/product-page");
    }
  };

  return (
    <>
      <h1>Giỏ hàng</h1>

      {/* Bảng hiển thị thông tin người dùng */}
      <h2>Thông tin người dùng</h2>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>Tên:</th>
            <td>{state.userId.user?.fullName}</td>
          </tr>
          <tr>
            <th>Địa chỉ:</th>
            <td>{state.userId.user?.address}</td>
          </tr>
          <tr>
            <th>Số điện thoại:</th>
            <td>{state.userId.user?.phone}</td>
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

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Màu sắc</th>
            <th>Lưu trữ</th>
            <th>Mô tả</th>
            <th>Số lượng mua</th>
            <th>Giá</th>
            <th>Thành tiền</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {state.products.map((product: CartItem, index: number) => (
            <tr key={product.product?._id}>
              <td>{index + 1}</td>
              <td>{product.product?.title}</td>
              <td>{product.product?.color}</td>
              <td>{product.product?.storage}</td>
              <td>{product.product?.description}</td>
              <td>
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
              <td>{product.product?.price}</td>
              <td>{product.product?.price * product?.quantity}</td>
              <td>
                <button
                  onClick={() =>
                    handleRemoveFromCart(String(product.product._id))
                  }
                  className="btn btn-danger"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={7}>Tổng tiền</td>
            <td>{state.totalPrice}</td>
            <td>
              <button onClick={handleCheckout} className="btn btn-success">
                Thanh toán
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Cart;
