import { Products } from "../../interfaces/Products";
import { User } from "../../interfaces/User";

export type CartItem = {
  product: Products;
  quantity: number;
};

type State = {
  products: CartItem[];
  totalPrice: number;
  order: any; // Thêm thông tin order
};

type CartAction =
  | { type: "ADD_TO_CART"; payload: { product: Products; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: { productId: string } }
  | { type: "SET_CART"; payload: { products: CartItem[]; totalPrice: number } }
  | { type: "CHECKOUT"; payload: any }; // Thêm loại hành động cho checkout

// Thêm loại hành động cho checkout

const cartReducer = (state: State, action: CartAction) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingProduct = state.products.find(
        (item) => item.product?._id === action.payload.product?._id
      );
      if (existingProduct) {
        return {
          ...state,
          products: state.products.map((item) =>
            item.product?._id === action.payload.product?._id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          products: [
            ...state.products,
            {
              product: action.payload.product,
              quantity: action.payload.quantity,
            },
          ],
        };
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        products: state.products.filter(
          (item) => item.product?._id !== action.payload.productId
        ),
      };

    case "SET_CART":
      return {
        ...state,
        userId: action.payload,
        products: action.payload.products,
        totalPrice: action.payload.totalPrice,
      };

    case "CHECKOUT":
      return {
        ...state,
        order: action.payload, // Lưu thông tin đơn hàng sau thanh toán
      };

    default:
      return state;
  }
};

export default cartReducer;
