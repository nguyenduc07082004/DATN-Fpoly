import { User } from "../../interfaces/User";

type State = {
  user: User[];
};

type Action =
  | { type: "LIST_USER"; payload: User[] }
  | { type: "ADD_USER"; payload: User }
  | { type: "EDIT_USER"; payload: User }
  | { type: "DELETE_USER"; payload: string };

const UserReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LIST_USER":
      return { ...state, user: action.payload };
    case "ADD_USER":
      return { ...state, user: [...state.user, action.payload] };
    case "EDIT_USER":
      return {
        ...state,
        user: state.user.map((i) =>
          i.id === action.payload.id ? action.payload : i
        ),
      };
    case "DELETE_USER":
      return {
        ...state,
        user: state.user.filter((i) => i.id !== action.payload),
      };
  }
};
export default UserReducer;
