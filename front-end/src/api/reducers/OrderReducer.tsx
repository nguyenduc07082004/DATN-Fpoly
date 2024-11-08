import { Products } from "../../interfaces/Products";

export type CartItem = {
  product: Products;
  quantity: number;
};

type State = {
  orders: CartItem[];
  items: CartItem[];
  totalPrice: number;
};

type CartAction = {
  type: "SET_ORDER";
  payload: { orders: CartItem[]; items: CartItem[]; totalPrice: number };
};

const initialState: State = {
  orders: [],
  items: [],
  totalPrice: 0,
};

const orderReducer = (
  state: State = initialState,
  action: CartAction
): State => {
  switch (action.type) {
    case "SET_ORDER":
      return {
        ...state,
        orders: action.payload.orders,
        items: action.payload.items,
        totalPrice: action.payload.totalPrice,
      };

    default:
      return state;
  }
};

export default orderReducer;
