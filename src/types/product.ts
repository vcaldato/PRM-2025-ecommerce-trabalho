import type { Category } from "./category";

export interface Brand {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
  category: Category;
  brand?: Brand;
  imageUrl?: string;
}


