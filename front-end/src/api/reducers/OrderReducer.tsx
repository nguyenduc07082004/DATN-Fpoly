import { Products } from "../../interfaces/Products";
import { User } from "../../interfaces/User";

export type CartItem = {
  product: Products;
  quantity: number;
};

export type State = {
  userId: User | null;
  items: CartItem[];
  totalPrice: number;
};

type CartAction = {
  type: "SET_ORDER";
  payload: State;
};

// Thêm loại hành động cho checkout

const orderReducer = (state: State, action: CartAction) => {
  switch (action.type) {
    case "SET_ORDER":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default orderReducer;
