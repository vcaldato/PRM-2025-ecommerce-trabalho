import { api } from "@/lib/axios";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>("/categories");
  return data;
};

export interface ProductQuery {
  categoryId?: string;
  search?: string;
}

const includesTerm = (value: string | undefined, term: string): boolean => {
  if (!value) {
    return false;
  }
  return value.toLowerCase().includes(term.toLowerCase());
};

export const fetchProducts = async ({
  categoryId,
  search,
}: ProductQuery = {}): Promise<Product[]> => {
  const params = categoryId ? { categoryId } : undefined;
  const { data } = await api.get<Product[]>("/products", { params });

  if (!search?.trim()) {
    return data;
  }

  return data.filter(
    (product) =>
      includesTerm(product.name, search) ||
      includesTerm(product.description, search),
  );
};

export const fetchProductDetail = async (id: string): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};


