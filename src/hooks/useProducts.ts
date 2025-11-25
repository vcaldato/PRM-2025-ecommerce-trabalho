import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ProductQuery } from "@/services/catalog";

export const useProducts = (query: ProductQuery = {}) =>
  useQuery({
    queryKey: ["products", query],
    queryFn: () => fetchProducts(query),
  });


