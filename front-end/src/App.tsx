import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Client from "./user/ClientRouter";
import Dashboard from "./admin/quanly/AdminRouter";
import Cart from "./user/Cart/Cart";

function App() {
  return (
    <>
      <Routes>
        {/* Route tổng */}
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/*" element={<Client />} />
      </Routes>
    </>
  );
}

export default App;
