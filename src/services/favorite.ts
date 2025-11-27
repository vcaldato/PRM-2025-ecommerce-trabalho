import { api } from "@/lib/axios";
import type { Product } from "@/types/product";

export interface Favorite {
  id: string;
  product: Product;
}

export const favoriteService = {
  async add(customerId: string, productId: string): Promise<Favorite> {
    const { data } = await api.post<Favorite>("/favorites", {
      customerId,
      productId,
    });
    return data;
  },

  async remove(customerId: string, productId: string): Promise<void> {
    await api.delete(`/favorites/${customerId}/${productId}`);
  },

  async findByCustomerId(customerId: string): Promise<Favorite[]> {
    const { data } = await api.get<Favorite[]>(`/favorites/customer/${customerId}`);
    return data;
  },

  async isFavorite(customerId: string, productId: string): Promise<boolean> {
    try {
      const { data } = await api.get<{ isFavorite: boolean }>(
        `/favorites/customer/${customerId}/product/${productId}`,
      );
      return data.isFavorite;
    } catch {
      return false;
    }
  },
};

