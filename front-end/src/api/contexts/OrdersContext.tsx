import React, { createContext, useReducer, ReactNode } from "react";
import ins from "../../api";
import orderReducer, { CartItem } from "../../api/reducers/OrderReducer";

export interface OrderContextType {
  state: {
    orders: CartItem[];
    items: CartItem[];
    totalPrice: number;
  };
  dispatch: React.Dispatch<any>;
  getOrder: () => Promise<void>;
}

const initialState = {
  orders: [],
  items: [],
  totalPrice: 0,
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const getOrder = async () => {
    try {
      const res = await ins.get("/orders");
      if (res.data) {
        dispatch({ type: "SET_ORDER", payload: res.data });
      } else {
        console.error("Error: Order data is null");
      }
    } catch (error) {
      console.error("Error getting order:", error);
    }
  };

  return (
    <OrderContext.Provider value={{ state, dispatch, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext, OrderProvider };
