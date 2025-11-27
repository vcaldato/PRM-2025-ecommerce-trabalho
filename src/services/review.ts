import { api } from "@/lib/axios";
import type { Product } from "@/types/product";

export interface Review {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  product: Product;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ProductRating {
  average: number;
  count: number;
}

export const reviewService = {
  async create(
    customerId: string,
    productId: string,
    rating: number,
    comment?: string,
    orderId?: string,
  ): Promise<Review> {
    const { data } = await api.post<Review>("/reviews", {
      customerId,
      productId,
      rating,
      comment,
      orderId,
    });
    return data;
  },

  async findByProductId(productId: string): Promise<Review[]> {
    const { data } = await api.get<Review[]>(`/reviews/product/${productId}`);
    return data;
  },

  async getProductRating(productId: string): Promise<ProductRating> {
    const { data } = await api.get<ProductRating>(
      `/reviews/product/${productId}/rating`,
    );
    return data;
  },
};

