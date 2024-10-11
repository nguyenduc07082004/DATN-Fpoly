import { createContext, useEffect, useReducer } from "react";

import ins from "..";
import { Category } from "../../interfaces/Category";
import categoryReducer from "../reducers/CategoryReducers";

export type CateContextType = {
  state: { category: Category[] };
  onDel: (id: string) => void;
  onSubmitCategory: (data: Category) => void;
  dispatch: React.Dispatch<any>;
};

export const CategoryContext = createContext({} as CateContextType);

export const CateProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(categoryReducer, { category: [] });
  const fetchProducts = async () => {
    const { data } = await ins.get("/categories");
    dispatch({ type: "LIST_CATEGORY", payload: data });
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const onDel = (id: string) => {
    (async () => {
      if (confirm("SURE?")) {
        await ins.delete(`/categories/${id}`);
        dispatch({ type: "DELETE_CATEGORY", payload: id });
      }
    })();
    fetchProducts();
  };

  const onSubmitCategory = async (category: Category) => {
    try {
      if (category.id) {
        // logic edit

        const { data } = await ins.patch(
          `/categories/${category.id}`,
          category
        );
        dispatch({ type: "EDIT_CATEGORY", payload: data });
      } else {
        // logic add
        const { data } = await ins.post(`/categories`, category);
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
      value={{ state, dispatch, onDel, onSubmitCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
