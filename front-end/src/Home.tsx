import { Link } from "react-router-dom";
import { Products } from "./interfaces/Products";

type Props = {
  products: Products[];
  onDel: (id: any) => void;
};

const Home = ({ products, onDel }: Props) => {
  const Del = (id: any) => {
    onDel(id);
  };
  return (
    <div>
      <button className="btn btn-primary">
        <Link className="text-white " to="/add">
          Add
        </Link>
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.title}</td>
              <td>{i.price}</td>
              <td>{i.description}</td>
              <td>
                <button className="btn btn-danger" onClick={() => Del(i.id)}>
                  Del
                </button>
                <button className="btn btn-warning">
                  <Link to={`/edit/${i.id}`}>Edit</Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
