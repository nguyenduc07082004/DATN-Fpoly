import { Category } from "./Category";

export interface Variant {
  _id?: string;
  color: string; 
  storage: string; 
  price: number; 
  quantity: number; 
  sku: string;
  variantImages: variantImages[];
}

export interface Products {
  _id?: string;
  title: string; 
  price: number; 
  image: string; 
  categories: Category | Category[];
  quantity: number; 
  description: string; 
  variants: Variant[];
  priceRange : number;
  default_price: number
  averageRating: number;
}
export interface CartItem extends Products {
  quantity: number;
}


export interface variantImages { 
  variant_id: string,
  url: string,
  alt_text: string,
  order: number
}