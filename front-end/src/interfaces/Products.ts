export interface Products {
  _id?: string; // Nếu có _id là chuỗi thì không cần `any` nữa
  title: string;
  price: number;
  image: string;
  categories: string | string[]; // Nếu categories là một mảng hoặc chỉ một chuỗi
  quantity: number;
  description: string;
  storage: string;
  colors: string[]; // Mảng chuỗi các màu sắc
}

export interface CartItem extends Products {
  quantity: number;
}