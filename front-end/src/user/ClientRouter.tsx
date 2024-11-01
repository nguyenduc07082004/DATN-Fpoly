import { Route, Routes } from "react-router-dom";
import ProductPage from "./page/ProductPage";
import ProdfuctList from "./ProductList/ProductList";
import Header from "./home/Header";
import Footer from "./home/Footer";
import Home from "./home/Home";
import Login from "./middleware/Login";
import Register from "./middleware/Register";
import ProductsDetails from "./page/ProductsDetails";
import Cart from "./Cart/Cart";
import FromUser from "./middleware/authUser/FromUser";
const Client = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/other" element={<ProductPage />} />{" "}
        {/* Thay đổi theo trang khác */}
        <Route path="/products" element={<ProdfuctList />} />
        <Route path="/products/:productId" element={<ProductsDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/user/:id" element={<FromUser />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Client;
