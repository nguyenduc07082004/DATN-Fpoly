import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import ins from "../../api"; // Giả định đây là instance axios hoặc hàm call API
import orderReducer, {
  initialState,
  State,
} from "../../api/reducers/OrderReducer";

// Import CartItem từ đúng file nơi đã định nghĩa
import { CartItem } from "../../interfaces/Cart";

interface OrderContextType {
  state: State;
  dispatch: React.Dispatch<any>; // Thêm dispatch vào OrderContextType
  fetchOrder: (page: number, limit: number) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
  updatePaymentStatus: (orderId: string, payment_status: string) => void;
  addOrder: (order: CartItem) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const fetchOrder = async (page: number, limit: number) => {
    try {
      const res = await ins.get("/orders", {
        params: {
          page: page,
          limit: limit,
        },
      });

  
      dispatch({
        type: "GET_ORDER",
        payload: {
          products: res.data.orders,
          totalOrders: res.data.totalOrders, 
        },
      });
    } catch (error) {
      console.error("Không thể lấy đơn hàng: ", error);
    }
  };
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ins.patch(`/orders/${orderId}`, { status });
      dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId, status } });
    } catch (error) {
      console.error("Cập nhật trạng thái đơn hàng thất bại:", error);
    }
  };

  const updatePaymentStatus = async (orderId: string, payment_status: string) => {
    try {
      await ins.patch(`/orders/payment/${orderId}`, { payment_status });
      dispatch({ type: "UPDATE_PAYMENT_STATUS", payload: { orderId, payment_status } });
    } catch (error) {
      console.error("Cập nhật trạng thái đơn hàng thất bại:", error);
    }
  };

  const addOrder = (order: CartItem) => {
    dispatch({ type: "ADD_ORDER", payload: order });
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        state,
        dispatch,
        fetchOrder,
        updateOrderStatus,
        addOrder,
        updatePaymentStatus
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext, OrderProvider };
export type { OrderContextType };
