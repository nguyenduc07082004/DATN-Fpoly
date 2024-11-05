import Sidebar from "../Sidebar";
import { Route, Routes } from "react-router-dom";
import "../../App.scss";
import QLSP from "./QLSP";

import Form from "../form/AddForm";
import QLTK from "./QLTK";
import QLBL from "./QLBL";
import QLDM from "./QLDM";
import QLDH from "./QLDH";
import TK from "./TK";
import TrangChu from "./TrangChu";
import CateForm from "../form/CateForm";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "../../api/contexts/AuthContext";
import Details from "./Details";
import AddForm from "../form/AddForm";
import EditForm from "../form/EditForm";

function Dashboard() {
  const { user } = useContext(AuthContext) as AuthContextType;

  if (user?.role !== "admin") {
    return <h1>Access denied. You are not an admin.</h1>;
  }
  return (
    <div className="d-flex background">
      <div>
        <Sidebar />
      </div>

      <div
        className="bg-light mx-3 content rounded-3"
        style={{ height: "600px", width: "1000rem" }}
      >
        <Routes>
          {/* QLSP */}
          <Route path="/" element={<TrangChu />} />
          <Route path="/qlsp" element={<QLSP />} />
          <Route path="qlsp/add" element={<AddForm />} />
          <Route path="/qlsp/edit/:id" element={<EditForm />} />
          <Route path="/qltk" element={<QLTK />} />
          <Route path="/qlbl" element={<QLBL />} />
          <Route path="/qldh" element={<QLDH />} />
          <Route path="/tk" element={<TK />} />
          <Route path="/details/:id" element={<Details />} />

          {/* QLDM */}
          <Route path="/qldm" element={<QLDM />} />
          <Route path="qldm/add" element={<CateForm />} />
          <Route path="/qldm/edit/:id" element={<CateForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
