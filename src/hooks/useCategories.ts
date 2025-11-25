import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/catalog";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });


