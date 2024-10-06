import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Sidebar from "./admin/Sidebar";
import QLSP from "./admin/pages/QLSP";
import QLTK from "./admin/pages/QLTK";
import QLBL from "./admin/pages/QLBL";
import QLDM from "./admin/pages/QLDM";
import QLDH from "./admin/pages/QLDH";
import TK from "./admin/pages/TK";
import { useEffect, useState } from "react";
import ins from "./api";

function App() {
  const [p, setP] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await ins.get("/products");
      setP(data.data);
    })();
  }, []);
  return (
    <>
      <div className="d-flex background">
        <div>
          <Sidebar />
        </div>
        <div
          className="bg-light mx-3 content "
          style={{ height: "600px", width: "1000rem" }}
        >
          <Routes>
            <Route path="/qlsp" element={<QLSP products={p} />} />
            <Route path="/qltk" element={<QLTK />} />
            <Route path="/qlbl" element={<QLBL />} />
            <Route path="/qldm" element={<QLDM />} />
            <Route path="/qldh" element={<QLDH />} />
            <Route path="/tk" element={<TK />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
