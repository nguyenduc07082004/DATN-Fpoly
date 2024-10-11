import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Client from "./user/Client";
import Dashboard from "./admin/quanly/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Client />}></Route>
        <Route path="/admin/*" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
}

export default App;
