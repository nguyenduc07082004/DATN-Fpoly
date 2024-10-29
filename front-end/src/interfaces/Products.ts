export interface Products {
  name: ReactNode;
  id: Key | null | undefined;
  _id: any;
  title: string;
  price: number;
  imageURL: string;
  categories: any | string;
  quantity: number;
  description: string;
}
