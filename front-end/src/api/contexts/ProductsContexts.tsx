import { createContext, useEffect, useReducer, useState } from "react";

import productsReducer from "../reducers/ProductsReducers";
import ins from "..";
import { Products } from "../../interfaces/Products";

export type ProdContextType = {
  onDel: (id: string) => void;
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
};

export const ProdContext = createContext({} as ProdContextType);

export const ProdProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, { products: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 5; // Số sản phẩm trên mỗi trang

  //Tìm kiếm sản phẩm
  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  const filteredProducts = state.products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Phân trang
  // Tính toán số sản phẩm cần hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
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
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  //Logic xóa sản phẩm
  const onDel = (id: string) => {
    (async () => {
      if (confirm("SURE?")) {
        await ins.delete(`/products/${id}`);
        dispatch({ type: "DELETE_PRODUCT", payload: id });
      }
    })();
    fetchProducts();
  };

  //Logic thêm/sửa sản phẩm
  const onSubmitProduct = async (product: Products) => {
    try {
      if (product.id) {
        const { data } = await ins.patch(`/products/${product.id}`, product);
        dispatch({ type: "EDIT_PRODUCT", payload: data });
      } else {
        const { data } = await ins.post(`/products`, product);
        dispatch({ type: "ADD_PRODUCT", payload: data });
      }
      window.location.href = "/admin/qlsp";
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ProdContext.Provider
      value={{
        state,
        dispatch,
        onDel,
        onSubmitProduct,
        handlePrevPage,
        handleNextPage,
        currentProducts,
        currentPage,
        totalPages,
        indexOfFirstProduct,
        handleSearch,
        searchQuery,
      }}
    >
      {children}
    </ProdContext.Provider>
  );
};
