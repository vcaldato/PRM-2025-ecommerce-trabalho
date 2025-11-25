import { useQuery } from "@tanstack/react-query";
import { fetchProductDetail } from "@/services/catalog";

export const useProductDetail = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductDetail(id),
    enabled: Boolean(id),
  });


