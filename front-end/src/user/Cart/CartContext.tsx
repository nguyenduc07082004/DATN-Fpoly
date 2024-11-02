// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Products } from "../../interfaces/Products";

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: Products) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Products) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        console.log(`Sản phẩm ${product.title} đã có trong giỏ hàng, tăng số lượng.`);
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        console.log(`Thêm sản phẩm mới ${product.title} vào giỏ hàng.`);
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    console.log("Cart items after adding:", cartItems);
  };

  const removeFromCart = (id: string | number) => {
    setCartItems(prevItems => {
      console.log(`Xóa sản phẩm có ID: ${id} khỏi giỏ hàng.`);
      return prevItems.filter(item => item._id !== id);
    });
    console.log("Cart items after removing:", cartItems);
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    setCartItems(prevItems => {
      console.log(`Cập nhật số lượng của sản phẩm ID: ${id} thành ${quantity}`);
      return prevItems.map(item =>
        item._id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      );
    });
    console.log("Cart items after quantity update:", cartItems);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
