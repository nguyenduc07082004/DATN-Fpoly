import Home from "./home/Home";
import { Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";

const Client = () => {
  return <div>
    <Home/>
    <Routes>
       <Route path="/" element={<HomePage/>} />
    </Routes>
  </div>;
};

export default Client;
