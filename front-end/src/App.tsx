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
import Form from "./admin/form/Form";
import { Products } from "./interfaces/Products";
import Client from "./user/Client";
import Home from "./admin/pages/Home";
import Dashboard from "./admin/pages/Dashboard";

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
      <Header />  {}
      <UserSidebar />  {}
      <Routes>
        <Route path="/" element={<Client />}></Route>
        <Route path="/admin/*" element={<Home />}>
          <Route
            path="admin/qlsp"
            element={<QLSP onDel={handleRemove} products={p} />}
          />
          <Route path="admin/qlsp/add" element={<Form onSubmit={onSubmit} />} />
          <Route
            path="admin/qlsp/edit/:id"
            element={<Form onSubmit={onSubmit} />}
          />
          <Route path="admin/qltk" element={<QLTK />} />
          <Route path="admin/qlbl" element={<QLBL />} />
          <Route path="admin/qldm" element={<QLDM />} />
          <Route path="admin/qldh" element={<QLDH />} />
          <Route path="admin/tk" element={<TK />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;