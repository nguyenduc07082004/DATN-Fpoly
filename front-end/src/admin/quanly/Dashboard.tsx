import Sidebar from "../Sidebar";
import { Route, Routes } from "react-router-dom";
import "../../App.scss";
import QLSP from "./QLSP";

import Form from "../form/Form";
import QLTK from "./QLTK";
import QLBL from "./QLBL";
import QLDM from "./QLDM";
import QLDH from "./QLDH";
import TK from "./TK";

function Dashboard() {
  return (
    <div className="d-flex background">
      <div>
        <Sidebar />
      </div>
      <div
        className="bg-light mx-3 content "
        style={{ height: "600px", width: "1000rem" }}
      >
        <Routes>
          <Route path="/qlsp" element={<QLSP />} />
          <Route path="qlsp/add" element={<Form />} />
          <Route path="/qlsp/edit/:id" element={<Form />} />
          <Route path="qltk" element={<QLTK />} />
          <Route path="/qlbl" element={<QLBL />} />
          <Route path="/qldm" element={<QLDM />} />
          <Route path="/qldh" element={<QLDH />} />
          <Route path="/tk" element={<TK />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
