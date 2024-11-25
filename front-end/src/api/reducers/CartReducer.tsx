import { Products } from "../../interfaces/Products";
import { User } from "../../interfaces/User";

export type CartItem = {
  product : Products;
  quantity: number;
  price: number;
};

type State = {
  products: CartItem[];
  totalPrice: number;
  order: any; // Thêm thông tin order
};

type CartAction =
  | { type: "ADD_TO_CART"; payload: {price: number; product: Products; quantity: number }}
  | { type: "REMOVE_FROM_CART"; payload: { productId: string } }
  | { type: "SET_CART"; payload: { products: CartItem[]; totalPrice: number } }
  | { type: "CHECKOUT"; payload: any }; // Thêm loại hành động cho checkout

const cartReducer = (state: State, action: CartAction) => {
  switch (action.type) {
    case "ADD_TO_CART":
  const existingProduct = state.products.find(
    (item) => item.product?._id === action.payload.product?._id
  );
  
  let newProducts;
  if (existingProduct) {
    // Cập nhật lại số lượng của sản phẩm có sẵn trong giỏ hàng
    newProducts = state.products.map((item) =>
      item.product?._id === action.payload.product?._id
        ? { ...item, quantity: item.quantity + action.payload.quantity }
        : item
    );
  } else {
    newProducts = [
      ...state.products,
      {
        product: action.payload.product,
        quantity: action.payload.quantity,
        price: action.payload.price,
      },
    ];
  }

  const totalPrice = newProducts.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return {
    ...state,
    products: newProducts,
    totalPrice, 
  };


    case "REMOVE_FROM_CART":
      // Tính lại giá trị tổng sau khi xóa sản phẩm
      const productToRemove = state.products.find(
        (item) => item.product._id === action.payload.productId
      );
      return {
        ...state,
        products: state.products.filter(
          (item) => item.product._id !== action.payload.productId
        ),
        totalPrice: productToRemove
          ? state.totalPrice - productToRemove.price * productToRemove.quantity // Cập nhật tổng giá trị sau khi xóa
          : state.totalPrice,
      };

      case "SET_CART":
        // Tính toán lại totalPrice từ các sản phẩm trong giỏ hàng
        const calculatedTotalPrice = action.payload.products.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        );
      
        return {
          ...state,
          products: action.payload.products,
          totalPrice: calculatedTotalPrice, // Cập nhật lại totalPrice
        };

    case "CHECKOUT":
      return {
        ...state,
        order: action.payload, // Lưu thông tin đơn hàng sau thanh toán
        products: [], // Sau khi thanh toán, xóa hết sản phẩm trong giỏ
        totalPrice: 0, // Đặt lại tổng giá trị giỏ hàng về 0
      };

    default:
      return state;
  }
};

export default cartReducer;


