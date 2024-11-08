import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { ProdProvider } from "./api/contexts/ProductsContexts.tsx";
import { CateProvider } from "./api/contexts/CategoryContext.tsx";
import { UserProvider } from "./api/contexts/UserContext.tsx";
import { AuthProvider } from "./api/contexts/AuthContext.tsx";
import { CartProvider } from "./api/contexts/CartContext.tsx";
import { OrderProvider } from "./api/contexts/OrdersContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProdProvider>
        <AuthProvider>
          <CateProvider>
            <UserProvider>
              <CartProvider>
                <OrderProvider>
                  <App />
                </OrderProvider>
              </CartProvider>
            </UserProvider>
          </CateProvider>
        </AuthProvider>
      </ProdProvider>
    </BrowserRouter>
  </React.StrictMode>
);
