import { createContext, useEffect, useReducer, useState } from "react";

import ins from "..";
import UserReducer from "../reducers/UserReducer";
import { User } from "../../interfaces/User";

export type ProdContextType = {
  onDel: (id: string) => void;
  dispatch: React.Dispatch<any>;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleSearch: (event: any) => void;
  state: { user: User[] };
  currentProducts: User[];
  currentPage: number;
  totalPages: number;
  indexOfFirstProduct: number;
  searchQuery: string;
};

export const UserContext = createContext({} as ProdContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(UserReducer, { user: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 5; // Số sản phẩm trên mỗi trang

  //Tìm kiếm sản phẩm
  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  const filteredProducts = state.user?.filter((user) =>
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
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
    const { data } = await ins.get("/users");
    dispatch({ type: "LIST_USER", payload: data });
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  //Logic xóa sản phẩm
  const onDel = (id: string) => {
    (async () => {
      if (confirm("SURE?")) {
        await ins.delete(`/users/${id}`);
        dispatch({ type: "DELETE_USER", payload: id });
      }
    })();
    fetchProducts();
  };

  return (
    <UserContext.Provider
      value={{
        dispatch,
        onDel,
        handlePrevPage,
        handleNextPage,
        handleSearch,
        state,
        currentProducts,
        currentPage,
        totalPages,
        indexOfFirstProduct,
        searchQuery,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
