import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import ins from "../../api";
import orderReducer, {
  initialState,
  State,
} from "../../api/reducers/OrderReducer";

interface OrderContextType {
  state: State;
  fetchOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const fetchOrder = async () => {
    const res = await ins.get("/orders");
    dispatch({ type: "GET_ORDER", payload: res.data });
  };
  useEffect(() => {
    fetchOrder();
  }, []);
  return (
    <OrderContext.Provider value={{ state, fetchOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext, OrderProvider };
export type { OrderContextType };
