import { createContext, useEffect, useReducer, useState } from "react";

import productsReducer, { initialState } from "../reducers/ProductsReducers";
import ins from "..";
import { Products } from "../../interfaces/Products";
import axios from "axios";

export type ProdContextType = {
  onDel: (_id: string) => void;
  dispatch: React.Dispatch<any>;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleSearch: (event: any) => void;
  state: { products: Products[] };
  currentProducts: Products[];
  currentPage: number;
  totalPages: number;
  indexOfFirstProduct: number;
  searchQuery: string;
  productsPerPage: number;
  onChangeHandler: (event: any) => void;
  setImage: React.Dispatch<React.SetStateAction<boolean>>;
  data1: any;
};

export const ProdContext = createContext({} as ProdContextType);

export const ProdProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 6; // Số sản phẩm trên mỗi trang
  const [image, setImage] = useState<any>(null);
  const [data1, setData] = useState({
    title: "",
    price: "",
    storage: "",
    color: "",
    categories: "Điện thoại",
    quantity: "",
    description: "",
  });
  const onChangeHandler = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data1) => ({ ...data1, [name]: value }));
    console.log(name, value);
  };
  //Tìm kiếm sản phẩm
  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  const filteredProducts = state.products?.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Phân trang
  // Tính toán số sản phẩm cần hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredProducts?.length / productsPerPage);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Lấy dữ liệu từ server
  const fetchProducts = async () => {
    const { data } = await ins.get("/products");
    dispatch({ type: "LIST_PRODUCTS", payload: data });
    console.log(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //Logic xóa sản phẩm
  const onDel = (_id: string) => {
    (async () => {
      if (confirm("SURE?")) {
        await ins.delete(`/products/${_id}`);
        dispatch({ type: "DELETE_PRODUCT", payload: _id });
      }
    })();
    fetchProducts();
  };

  return (
    <ProdContext.Provider
      value={{
        data1,
        dispatch,
        onDel,
        handlePrevPage,
        handleNextPage,
        handleSearch,
        onChangeHandler,
        setImage,
        state,
        currentProducts,
        currentPage,
        totalPages,
        indexOfFirstProduct,
        searchQuery,
        productsPerPage,
      }}
    >
      {children}
    </ProdContext.Provider>
  );
};
