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

type Props = {};

const TK = (props: Props) => {
  const { state } = useContext(ProdContext);
  return (
    <div>
      <BarChart width={730} height={250} data={state.products}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="price" fill="#8884d8" />
        <Bar dataKey="quantity" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default TK;
