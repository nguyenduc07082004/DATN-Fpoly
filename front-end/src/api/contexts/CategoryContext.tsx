import { createContext, useEffect, useReducer, useState } from "react";

import ins from "..";
import { Category } from "../../interfaces/Category";
import categoryReducer from "../reducers/CategoryReducers";

export type CateContextType = {
  dataDM: { category: Category[] };
  onDel: (id: string) => void;
  onSubmitCategory: (data: Category) => void;
  dispatch: React.Dispatch<any>;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleSearch: (event: any) => void;
  currentProducts: Category[];
  currentPage: number;
  totalPages: number;
  indexOfFirstProduct: number;
  searchQuery: string;
};

export const CategoryContext = createContext({} as CateContextType);

export const CateProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataDM, dispatch] = useReducer(categoryReducer, { category: [] });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 6; // Số sản phẩm trên mỗi trang

  //Tìm kiếm sản phẩm
  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  const filteredProducts = dataDM.category?.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
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
  const fetchProducts = async () => {
    const { data } = await ins.get("/categories");
    dispatch({ type: "LIST_CATEGORY", payload: data });
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const onDel = (_id: string) => {
    (async () => {
      if (confirm("SURE?")) {
        await ins.delete(`/categories/${_id}`);
        dispatch({ type: "DELETE_CATEGORY", payload: _id });
      }
    })();
    fetchProducts();
  };

  const onSubmitCategory = async (category: Category) => {
    try {
      if (category._id) {
        // logic edit

        const { data } = await ins.put(
          `/categories/edit/${category._id}`,
          category
        );
        dispatch({ type: "EDIT_CATEGORY", payload: data });
      } else {
        // logic add
        const { data } = await ins.post(`/categories/add`, category);
        dispatch({ type: "ADD_CATEGORY", payload: data });
      }
      window.location.href = "/admin/qldm";
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <CategoryContext.Provider
      value={{
        dataDM,
        dispatch,
        onDel,
        onSubmitCategory,
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
    </CategoryContext.Provider>
  );
};
