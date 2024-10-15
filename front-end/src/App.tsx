import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Client from "./user/Client";
import Dashboard from "./admin/quanly/AdminRouter";
import Home from "./user/home/Home";
import ProductPage from "./user/page/ProductPage";
import ProdfuctList from "./user/ProductList/ProductList";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Client />}></Route>
        <Route path="/admin/*" element={<Dashboard />}></Route>
        <Route path="/" element={<Home />} />
        <Route path="/other" element={<ProductPage />} /> {/* Thay đổi theo trang khác */}
        <Route path="/products" element={<ProdfuctList />} />
      </Routes>
    </>
  );
}

export default App;
