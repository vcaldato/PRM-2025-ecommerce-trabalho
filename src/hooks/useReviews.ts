import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review";
import { customerService } from "@/services/customer";
import { useAuth } from "./useAuth";
import { useOrders } from "./useOrders";

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewService.findByProductId(productId),
    enabled: !!productId,
  });
};

export const useProductRating = (productId: string) => {
  return useQuery({
    queryKey: ["product-rating", productId],
    queryFn: () => reviewService.getProductRating(productId),
    enabled: !!productId,
  });
};

export const useCanReview = (productId: string) => {
  const { user } = useAuth();
  const { data: orders } = useOrders();

  const { data: customer } = useQuery({
    queryKey: ["customer", user?.id],
    queryFn: async () => {
      if (!user) return null;
      return customerService.findBySupabaseUserId(user.id);
    },
    enabled: !!user,
  });

  if (!customer || !orders) {
    return false;
  }

  const hasPurchased = orders.some((order) =>
    order.itens.some((item) => item.product.id === productId),
  );

  return hasPurchased;
};

export const useCreateReview = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: customer } = useQuery({
    queryKey: ["customer", user?.id],
    queryFn: async () => {
      if (!user) return null;
      return customerService.findBySupabaseUserId(user.id);
    },
    enabled: !!user,
  });

  return useMutation({
    mutationFn: ({
      productId,
      rating,
      comment,
      orderId,
    }: {
      productId: string;
      rating: number;
      comment?: string;
      orderId?: string;
    }) =>
      reviewService.create(
        customer!.id,
        productId,
        rating,
        comment,
        orderId,
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.productId] });
      queryClient.invalidateQueries({
        queryKey: ["product-rating", variables.productId],
      });
    },
  });
};

