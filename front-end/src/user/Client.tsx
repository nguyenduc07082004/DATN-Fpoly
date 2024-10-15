import Home from "./home/Home";
import { Route, Routes } from "react-router-dom";
import ProductPage from "./page/ProductPage";

const Client = () => {
  return <div>
    <Home/>
    <Routes>
       <Route path="/" element={<ProductPage/>} />
    </Routes>
  </div>;
};

export default Client;
