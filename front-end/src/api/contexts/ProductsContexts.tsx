import { createContext, useEffect, useReducer } from "react";

import productsReducer from "../reducers/ProductsReducers";
import ins from "..";
import { Products } from "../../interfaces/Products";

export type ProdContextType = {
  state: { products: Products[] };
  onDel: (id: string) => void;
  onSubmitProduct: (data: Products) => void;
  dispatch: React.Dispatch<any>;
};

export const ProdContext = createContext({} as ProdContextType);

export const ProdProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, { products: [] });
  const fetchProducts = async () => {
    const { data } = await ins.get("/products");
    dispatch({ type: "LIST_PRODUCTS", payload: data });
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const onDel = (id: string) => {
    (async () => {
      if (confirm("SURE?")) {
        await ins.delete(`/products/${id}`);
        dispatch({ type: "DELETE_PRODUCT", payload: id });
      }
    })();
    fetchProducts();
  };

  const onSubmitProduct = async (product: Products) => {
    try {
      if (product.id) {
        // logic edit

        const { data } = await ins.patch(`/products/${product.id}`, product);
        dispatch({ type: "EDIT_PRODUCT", payload: data });
      } else {
        // logic add
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
    <ProdContext.Provider value={{ state, dispatch, onDel, onSubmitProduct }}>
      {children}
    </ProdContext.Provider>
  );
};
