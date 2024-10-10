import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { Route, Routes, useNavigate } from "react-router-dom";
import "../../App.scss";
import QLSP from "./QLSP";
import { Products } from "../../interfaces/Products";
import ins from "../../api";
import Form from "../form/Form";
import QLTK from "./QLTK";
import QLBL from "./QLBL";
import QLDM from "./QLDM";
import QLDH from "./QLDH";
import TK from "./TK";

function Home() {
  const [p, setP] = useState<Products[]>([]);
  const nav = useNavigate();
  const fetchProducts = async () => {
    const { data } = await ins.get(`products`);
    setP(data);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleRemove = async (id: any) => {
    if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
      await ins.delete(`products/${id}`);
      setP(p.filter((item) => item.id !== id));
    }
  };
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
  return (
    <div className="d-flex background">
      <div>
        <Sidebar />
      </div>
    </div>
  );
}

export default Home;
