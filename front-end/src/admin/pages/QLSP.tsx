import React from "react";
import { Products } from "../../interfaces/Products";

type Props = {
  products: Products[];
};

const QLSP = ({ products }: Props) => {
  return (
    <div>
      <p className="m-3">
        <b className="h2">Quản lý sản phẩm</b>
      </p>
      <div className="d-flex py-4">
        <div className="mx-4">
          <button className="rounded">Thêm sản phẩm</button>
        </div>
        <div className="search">
          Search
          <input className="" type="text" />
        </div>
      </div>
      <hr className="tbl" />

      <table className="table">
        <thead className="text-center">
          <tr className="d-flex">
            <th className="col-1">STT</th>
            <th className="col-2">Tên sản phẩm</th>
            <th className="col-2">Giá(VND)</th>
            <th className="col-1">Số lượng</th>
            <th className="col-5">Mô tả</th>
            <th className="col-1">Chức năng</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {products.map((i) => (
            <tr className="d-flex" key={i.id}>
              <td className="col-1">{i.id}</td>
              <td className="col-2">{i.title}</td>
              <td className="col-2">{i.price}</td>
              <td className="col-1">{i.id}</td>
              <td className="col-5 text-truncate" style={{ maxWidth: "800px" }}>
                {i.description}
              </td>
              <td className="col-1">
                <button>Del</button>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLSP;
