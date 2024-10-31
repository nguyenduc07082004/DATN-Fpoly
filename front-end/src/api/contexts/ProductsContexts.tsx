import { createContext, useEffect, useReducer, useState } from "react";

import productsReducer, { initialState } from "../reducers/ProductsReducers";
import ins from "..";
import { Products } from "../../interfaces/Products";

export type ProdContextType = {
  onDel: (_id: string) => void;
  onSubmitProduct: (product: Products, e: any) => Promise<void>;
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
    setData((data) => ({ ...data, [name]: value }));
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

  //Logic thêm/sửa sản phẩm
  const onSubmitProduct = async (product: Products, e: any) => {
    e.preventDefault();
    try {
      let response;
      if (product._id) {
        response = await ins.put(`/products/edit/${product._id}`, product);
        dispatch({ type: "EDIT_PRODUCT", payload: response.data });
      } else {
        // response = await ins.post(`/products/add`, product);
        // dispatch({ type: "ADD_PRODUCT", payload: response.data });

        const formData = new FormData();
        formData.append("title", product.title);
        formData.append("price", String(product.price));
        formData.append("storage", product.storage);
        formData.append("color", product.color);
        if (image) {
          formData.append("image", image);
        }
        formData.append("categories", product.categories);
        formData.append("quantity", String(product.quantity));
        formData.append("description", product.description);

        response = await ins.post(`/products/add`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data);
        dispatch({ type: "ADD_PRODUCT", payload: response.data });
        if (response.data.success) {
          setData({
            title: "",
            price: "",
            storage: "",
            categories: "Điện thoại",
            quantity: "",
            color: "",
            description: "",
          });
          setImage(null);
        }
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
        data1,
        dispatch,
        onDel,
        onSubmitProduct,
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
