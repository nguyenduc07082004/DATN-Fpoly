import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import ins from "../../api"; // Giả định đây là instance axios hoặc hàm call API
import orderReducer, {
  initialState,
  State,
} from "../../api/reducers/OrderReducer";

interface OrderContextType {
  state: State;
  fetchOrder: () => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Hàm fetch danh sách đơn hàng từ API
  const fetchOrder = async () => {
    const res = await ins.get("/orders");
    dispatch({ type: "GET_ORDER", payload: { products: res.data } });
  };

  // Hàm cập nhật trạng thái của một đơn hàng
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      // Gửi yêu cầu cập nhật trạng thái lên API
      await ins.patch(`/orders/${orderId}`, { status });
      // Cập nhật trạng thái đơn hàng trong reducer
      dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId, status } });
    } catch (error) {
      console.error("Cập nhật trạng thái đơn hàng thất bại:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <OrderContext.Provider value={{ state, fetchOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext, OrderProvider };
export type { OrderContextType };
