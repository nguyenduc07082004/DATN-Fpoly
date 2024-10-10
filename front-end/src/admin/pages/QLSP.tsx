import { Products } from "../../interfaces/Products";
import "../.././App.scss";
type Props = {
  products: Products[];
  onDel: (id: any) => void;
};

const QLSP = ({ products, onDel }: Props) => {
  return (
    <div>
      <p className="m-3">
        <b className="h2">Quản lý sản phẩm</b>
      </p>
      <div className="d-flex py-4">
        <div className="mx-4">
          <button className="rounded">
            <a
              href="/admin/qlsp/add"
              className="text-decoration-none text-dark"
            >
              Thêm sản phẩm
            </a>
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
              <td className="col-1">{i.stock}</td>
              <td className="col-5 text-truncate" style={{ maxWidth: "800px" }}>
                {i.description}
              </td>
              <td className="col-1">
                <button
                  className="action-del rounded"
                  onClick={() => onDel(i.id)}
                >
                  Del
                </button>
                <button className="action-edit rounded">
                  <a
                    className="text-decoration-none text-white"
                    href={`/qlsp/edit/${i.id}`}
                  >
                    Edit
                  </a>
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
