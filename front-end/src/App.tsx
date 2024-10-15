import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Clien from "./user/Client";
import Dashboard from "./admin/quanly/AdminRouter";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Clien />}></Route>
        <Route path="/admin/*" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
}

export default App;
