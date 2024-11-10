import React, { createContext, useReducer, ReactNode } from "react";
import ins from "../../api";
import orderReducer, { CartItem } from "../../api/reducers/OrderReducer";
import { Products } from "../../interfaces/Products";
import { User } from "../../interfaces/User";

interface OrderContextType {
  state: {
    userId: User | null;
    items: { product: Products; quantity: number }[];
    totalPrice: number;
  };
  dispatch: React.Dispatch<any>;
  getOrder: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(orderReducer, {
    userId: null,
    items: [],
    totalPrice: 0,
  });

  const getOrder = async () => {
    try {
      const { data } = await ins.get("/orders");
      if (data) {
        dispatch({ type: "SET_ORDER", payload: data });
        console.log(data);
        
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
export type { OrderContextType };
