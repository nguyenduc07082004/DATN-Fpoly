import React, { useContext } from "react";
import Chart from "react-google-charts";
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
        <Bar dataKey="stock" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default TK;
