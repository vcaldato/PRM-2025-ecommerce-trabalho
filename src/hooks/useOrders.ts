import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import { customerService } from "@/services/customer";
import { useAuth } from "./useAuth";

export const useOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      const customer = await customerService.findBySupabaseUserId(user.id);
      if (!customer) {
        return [];
      }
      return orderService.findByCustomerId(customer.id);
    },
    enabled: !!user,
  });
};

