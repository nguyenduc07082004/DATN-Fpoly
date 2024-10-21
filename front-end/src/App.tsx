import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Client from "./user/Client";
import Dashboard from "./admin/quanly/AdminRouter";


function App() {
  return (
    <>
      <Client/>
      <Routes>
        {/* Route cho phần admin */}
        <Route path="/admin/*" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
