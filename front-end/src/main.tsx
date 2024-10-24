import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { ProdProvider } from "./api/contexts/ProductsContexts.tsx";
import { CateProvider } from "./api/contexts/CategoryContext.tsx";
import { UserProvider } from "./api/contexts/UserContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProdProvider>
        <CateProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </CateProvider>
      </ProdProvider>
    </BrowserRouter>
  </React.StrictMode>
);
