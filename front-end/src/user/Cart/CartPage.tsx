import React, { useContext, useEffect } from "react";
import { CartContext, CartContextType } from "../../api/contexts/CartContext";
import { CartItem } from "../../api/reducers/CartReducer";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const Cart = () => {
  const { state, removeFromCart, checkout, addToCart } = useContext(
    CartContext
  ) as CartContextType;
  const navigate = useNavigate();
  console.log(state);
  const token = localStorage.getItem("accessToken");

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };
  const handleDecreaseQuantity = (product: any) => {
    if (product?.quantity > 0) {
      addToCart(product.product, -1);
    }
    if (product?.quantity === 1) {
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
      alert("Thanh toán thành công");
      await checkout(); // Xử lý thanh toán
      navigate("/product-page"); // Chuyển hướng sang trang ProductPage
    }
  };

  return (
    <>
      <h1></h1>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
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
                  Xoa
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4}>Tong tien</td>
            <td>{state.totalPrice}</td>
            <td>
              <button onClick={handleCheckout} className="btn btn-success">
                Thanh toan
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Cart;
