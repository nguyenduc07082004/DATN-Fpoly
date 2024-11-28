export interface Category {
  _id: string; 
  parent_id: string | null;
  name: string; 
  image:string;
  slug: string;
  status: "active" | "inactive"; 
}
