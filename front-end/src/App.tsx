import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Client from "./user/Client";
import Dashboard from "./admin/quanly/AdminRouter";
import Home from "./user/home/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Client />}></Route>
        <Route path="/admin/*" element={<Dashboard />}></Route>
        <Route path="/" element={<Home />} />
        
      </Routes>
    </>
  );
}

export default App;
