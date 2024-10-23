import { Category } from "../../interfaces/Category";

type State = {
  category: Category[];
};

type Action =
  | { type: "LIST_CATEGORY"; payload: Category[] }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "EDIT_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: string };

const categoryReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LIST_CATEGORY":
      return { ...state, category: action.payload };
    case "ADD_CATEGORY":
      return { ...state, category: [...state.category, action.payload] };
    case "EDIT_CATEGORY":
      return {
        ...state,
        category: state.category.map((i) =>
          i._id === action.payload._id ? action.payload : i
        ),
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        category: state.category.filter((i) => i._id !== action.payload),
      };
  }
};
export default categoryReducer;
