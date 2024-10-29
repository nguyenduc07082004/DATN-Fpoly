import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Client from "./user/Client";
import Dashboard from "./admin/quanly/AdminRouter";
import Cart from "./user/Cart/Cart";
function App() {
  return (
    <>
      <Routes>
        {/* Route tổng */}

        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/*" element={<Client />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default App;
