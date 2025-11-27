import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteService } from "@/services/favorite";
import { customerService } from "@/services/customer";
import { useAuth } from "./useAuth";

export const useFavorites = () => {
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

  const {
    data: favorites = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["favorites", customer?.id],
    queryFn: () => favoriteService.findByCustomerId(customer!.id),
    enabled: !!customer,
  });

  const addFavorite = useMutation({
    mutationFn: (productId: string) =>
      favoriteService.add(customer!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-status"] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: (productId: string) =>
      favoriteService.remove(customer!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-status"] });
    },
  });

  return {
    favorites,
    isLoading,
    isError,
    addFavorite: addFavorite.mutate,
    removeFavorite: removeFavorite.mutate,
    isAdding: addFavorite.isPending,
    isRemoving: removeFavorite.isPending,
  };
};

export const useFavoriteStatus = (productId: string) => {
  const { user } = useAuth();

  const { data: customer } = useQuery({
    queryKey: ["customer", user?.id],
    queryFn: async () => {
      if (!user) return null;
      return customerService.findBySupabaseUserId(user.id);
    },
    enabled: !!user,
  });

  return useQuery({
    queryKey: ["favorite-status", customer?.id, productId],
    queryFn: () => favoriteService.isFavorite(customer!.id, productId),
    enabled: !!customer && !!productId,
  });
};

