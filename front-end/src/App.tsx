import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Client from "./user/Client";
import Dashboard from "./admin/quanly/AdminRouter";
import Home from "./user/home/Home";
import ProductsDeltais from "./user/page/ProductsDeltais"; // Thêm import cho trang chi tiết sản phẩm

function App() {
  return (
    <>
      <Routes>
        {/* Route trang chủ */}
        <Route path="/" element={<Home />} />

        {/* Route cho phần user client */}
        <Route path="/client" element={<Client />} />

        {/* Route cho phần admin */}
        <Route path="/admin/*" element={<Dashboard />} />

        {/* Route cho chi tiết sản phẩm */}
        <Route path="/products/:productId" element={<ProductsDeltais />} />
      </Routes>
    </>
  );
}

export default App;
