import "../.././App.scss";
import { useContext } from "react";

import { Link } from "react-router-dom";
import { CategoryContext } from "../../api/contexts/CategoryContext";

const QLDM = () => {
  const { state, onDel } = useContext(CategoryContext);
  return (
    <div>
      <p className="m-3">
        <b className="h2">Quản lý danh mục</b>
      </p>
      <div className="d-flex py-4">
        <div className="mx-4">
          <button className="rounded">
            <Link
              to="/admin/qldm/add"
              className="text-decoration-none text-dark"
            >
              Thêm danh mục
            </Link>
          </button>
        </div>
        <div className="search">
          Search
          <input className="rounded" type="text" />
        </div>
      </div>
      <hr className="tbl" />

      <table className="table">
        <thead className="text-center">
          <tr className="d-flex">
            <th className="col-1">STT</th>
            <th className="col-3">Tên danh mục</th>
            <th className="col-6">Ghi chú</th>
            <th className="col-2">Chức năng</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {state.category.map((i) => (
            <tr className="d-flex" key={i.id}>
              <td className="col-1">{i.id}</td>
              <td className="col-3">{i.name}</td>
              <td className="col-6 text-truncate" style={{ maxWidth: "800px" }}>
                {i.note}
              </td>
              <td className="col-2">
                <button
                  className="action-del rounded"
                  onClick={() => onDel(String(i.id))}
                >
                  Del
                </button>
                <button className="action-edit rounded">
                  <Link
                    className="text-decoration-none text-white"
                    to={`/admin/qldm/edit/${i.id}`}
                  >
                    Edit
                  </Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="">
        <button>Trang trước</button>
        <button>Trang sau</button>
      </div>
    </div>
  );
};

export default QLDM;
