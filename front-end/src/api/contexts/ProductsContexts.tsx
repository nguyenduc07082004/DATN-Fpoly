import { createContext, useEffect, useReducer, useState } from "react";

import productsReducer, { initialState } from "../reducers/ProductsReducers";
import ins from "..";
import { Products } from "../../interfaces/Products";

export type ProdContextType = {
  onDel: (_id: string) => void;
  onSubmitProduct: (data: Products) => void;
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
};

export const ProdContext = createContext({} as ProdContextType);

export const ProdProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 5; // Số sản phẩm trên mỗi trang

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

  //Logic thêm/sửa sản phẩm
  const onSubmitProduct = async (product: Products) => {
    try {
      let response;
      if (product._id) {
        response = await ins.put(`/products/edit/${product._id}`, product);
        dispatch({ type: "EDIT_PRODUCT", payload: response.data });
      } else {
        response = await ins.post(`/products/add`, product);
        dispatch({ type: "ADD_PRODUCT", payload: response.data });
      }
      window.location.href = "/admin/qlsp";
      fetchProducts();
    } catch (error) {
      console.error("Error submitting product:", error);
      // Optionally, display an error message to the user
      alert("There was an error submitting the product. Please try again.");
    }
  };
  return (
    <ProdContext.Provider
      value={{
        dispatch,
        onDel,
        onSubmitProduct,
        handlePrevPage,
        handleNextPage,
        handleSearch,
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
