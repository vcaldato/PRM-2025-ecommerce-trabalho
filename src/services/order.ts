import { api } from "@/lib/axios";

export interface CreateOrderDto {
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
  shipping?: number;
}

export interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  value: number;
}

export interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  shipping: number;
  total: number;
  status: string;
  itens: OrderItem[];
  createdAt: string;
}

export const orderService = {
  async create(orderData: CreateOrderDto): Promise<Order> {
    const { data } = await api.post<Order>("/orders", orderData);
    return data;
  },

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const { data } = await api.get<Order[]>(`/orders/customer/${customerId}`);
    return data;
  },

  async updateStatus(orderId: string, status: string): Promise<Order> {
    const { data } = await api.patch<Order>(`/orders/${orderId}/status`, {
      status,
    });
    return data;
  },
};

