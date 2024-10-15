import Home from "./home/Home";
import { Route, Routes } from "react-router-dom";
import ProductPage from "./page/ProductPage";
import ProdfuctList from "./ProductList/ProductList";

const Client = () => {
  return <div>
    <Home/>
    <Routes>
       <Route path="/" element={<ProductPage/>} />
       <Route path="/other" element={<ProductPage />} /> {/* Thay đổi theo trang khác */}
       <Route path="/products" element={<ProdfuctList />} />
    </Routes>
  </div>;
};

export default Client;
