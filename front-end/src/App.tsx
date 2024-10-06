import { Route, Routes, useNavigate } from "react-router-dom";
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
import Form from "./admin/form/Form";
import { Products } from "./interfaces/Products";

function App() {
  const [p, setP] = useState<Products[]>([]);
  const nav = useNavigate();
  const fetchProducts = async () => {
    const { data } = await ins.get(`products`);
    setP(data);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const onSubmit = async (data: Products) => {
    if (data.id) {
      await ins.patch(`/products/${data.id}`, data);
      fetchProducts();
    } else {
      const res = await ins.post(`/products`, data);
      setP([...p, res.data]);
    }
    nav("/qlsp");
  };
  const handleRemove = async (id: any) => {
    if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
      await ins.delete(`products/${id}`);
      setP(p.filter((item) => item.id !== id));
    }
  };
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
            <Route
              path="/qlsp"
              element={<QLSP onDel={handleRemove} products={p} />}
            />
            <Route path="/qlsp/add" element={<Form onSubmit={onSubmit} />} />
            <Route
              path="/qlsp/edit/:id"
              element={<Form onSubmit={onSubmit} />}
            />
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
