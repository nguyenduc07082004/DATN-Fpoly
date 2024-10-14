import "../.././App.scss";
import { useContext } from "react";
import { ProdContext } from "../../api/contexts/ProductsContexts";
import { Link } from "react-router-dom";

const QLSP = () => {
  const { state, onDel } = useContext(ProdContext);
  return (
    <div>
      <p className="m-3">
        <b className="h2">Quản lý sản phẩm</b>
      </p>
      <div className="d-flex py-4">
        <div className="mx-4">
          <button className="rounded">
            <Link
              to="/admin/qlsp/add"
              className="text-decoration-none text-dark"
            >
              Thêm sản phẩm
            </Link>
          </button>
        </div>
        <div className="search">
          Search
          <input className="rounded" type="text" placeholder="...Tìm kiếm" />
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
          {state.products.map((i) => (
            <tr className="d-flex" key={i.id}>
              <td className="col-1">{i.id}</td>
              <td className="col-2">{i.title}</td>
              <td className="col-2">{i.price}</td>
              <td className="col-1">{i.stock}</td>
              <td className="col-5 text-truncate" style={{ maxWidth: "800px" }}>
                {i.description}
              </td>
              <td className="col-1">
                <button
                  className="action-del rounded"
                  onClick={() => onDel(String(i.id))}
                >
                  Del
                </button>
                <button className="action-edit rounded">
                  <Link
                    className="text-decoration-none text-white"
                    to={`/admin/qlsp/edit/${i.id}`}
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

export default QLSP;
