import { Route, Routes } from "react-router-dom";
import ProductPage from "./page/ProductPage";

import ProductList from "./ProductList/ProductList";
import Header from "./home/Header";
import Footer from "./home/Footer";
import Home from "./home/Home";
import Login from "./middleware/Login";
import Register from "./middleware/Register";
import ProductsDetails from "./page/ProductsDetails";
import FromUser from "./middleware/authUser/FromUser";
import Cart from "./Cart/CartPage";
import VnpayPayment from "./page/Vnpay";
import CheckOut from "./page/CheckOut";
import OrderPlace from "./page/OrderPlace";
import Profile from "./page/Profile";
import ContactPage from "./page/ContactPage";
import IntroPage from "./page/IntroPage";
import OrderDetails from "./page/OrderDetails";
import Voucher from "./page/Voucher";
const Client = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/other" element={<ProductPage />} />{" "}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:productId" element={<ProductsDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/user/:id" element={<FromUser />} />
        <Route path="/vnpay" element={<VnpayPayment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/voucher" element={<Voucher />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/orderplace" element={<OrderPlace />} />
        <Route path="/orderplace/:id" element={<OrderDetails />} />
        <Route path="/contactPage" element={<ContactPage />} />
        <Route path="/introPage" element={<IntroPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Client;
