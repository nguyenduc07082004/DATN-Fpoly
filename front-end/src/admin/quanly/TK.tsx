import { useContext } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ProdContext } from "../../api/contexts/ProductsContexts";
import { CategoryContext } from "../../api/contexts/CategoryContext";

type Props = {};

const TK = (props: Props) => {
  const { state } = useContext(ProdContext);
  const { data } = useContext(CategoryContext);
  return (
    <div>
      <BarChart width={1200} height={250} data={state.products}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="categories" fill="#8884d8" />
        <Bar dataKey="price" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default TK;
