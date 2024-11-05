export interface Products {
  // name: ReactNode;
  // id: Key | null | undefined;
  _id?: any;
  title: string;
  price: number;
  image: string;
  categories: any | string;
  quantity: number;
  description: string;
  storage: string;
  color: string;
}

export interface CartItem extends Products {
  quantity: number;
}
