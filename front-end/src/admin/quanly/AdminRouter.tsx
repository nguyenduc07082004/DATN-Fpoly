import Sidebar from "../Sidebar";
import { Route, Routes } from "react-router-dom";
import "../../App.scss";
import QLSP from "./QLSP";
import QLTK from "./QLTK";
import QLBL from "./QLBL";
import QLDM from "./QLDM";
import QLDH from "./QLDH";
import TrangChu from "./TrangChu";
import CateForm from "../form/CateForm";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "../../api/contexts/AuthContext";
import Details from "./Details";
import AddForm from "../form/AddForm";
import EditForm from "../form/EditForm";
import VariantsForm from "../form/VariantsForm";
import OrderDetails from "./OrderDetails";
import EditVariantsForm from "../form/EditVariant";
import Invoice from "./Invoice";
import QLVC from "./QLVC";
import Trash from "./Trash";
import CommentRatingDetails from "./CommentRatingDetails";
function Dashboard() {
  const { user } = useContext(AuthContext) as AuthContextType;

  if (user?.role !== "admin") {
    return <h1>Access denied. You are not an admin.</h1>;
  }
  return (
    <div>
      <div className="d-flex background">
        <div>
          <Sidebar />
        </div>
        <div
          className="bg-light content rounded-3"
          style={{ height: "900px", width: "1170px" }}
        >
          <Routes>
            {/* QLSP */}
            <Route path="/" element={<TrangChu />} />
            <Route path="/qlsp" element={<QLSP />} />
            <Route path="qlsp/add" element={<AddForm />} />
            <Route path="/qlsp/edit/:id" element={<EditForm />} />
            <Route path="/qltk" element={<QLTK />} />
            <Route path="/qlbl" element={<QLBL />} />
            <Route path="/qlbl/details/:commentId" element={< CommentRatingDetails/>} />
            <Route path="/qldh" element={<QLDH />} />
            <Route path="/qlvc" element={<QLVC />} />
            <Route path="/qldh/:id" element={<OrderDetails />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/details/:id/variant/add" element={<VariantsForm />} />
            <Route
              path="/details/:id/variant/edit/:variantId"
              element={<EditVariantsForm />}
            />
            {/* QLDM */}
            <Route path="/qldm" element={<QLDM />} />
            <Route path="qldm/add" element={<CateForm />} />
            <Route path="/qldm/edit/:id" element={<CateForm />} />
            {/* QLHD */}
            <Route path="/qlhd" element={<Invoice />} />
            <Route path="/trash" element={<Trash/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
