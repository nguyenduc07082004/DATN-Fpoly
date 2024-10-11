import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { ProdProvider } from "./api/contexts/ProductsContexts.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProdProvider>
        <App />
      </ProdProvider>
    </BrowserRouter>
  </React.StrictMode>
);
