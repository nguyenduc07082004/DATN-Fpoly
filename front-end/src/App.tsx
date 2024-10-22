import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Client from "./user/Client";
import Dashboard from "./admin/quanly/AdminRouter";

function App() {
  return (
    <>
      <Routes>
        {/* Route tổng */}
        <Route path="/" element={<Client />} />
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/*" element={<Client />} />
      </Routes>
    </>
  );
}

export default App;
