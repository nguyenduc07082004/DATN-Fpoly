import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Home from "./user/home/Home";
import Dashboard from "./admin/quanly/AdminRouter";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/admin/*" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
}

export default App;
