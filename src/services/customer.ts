import { api } from "@/lib/axios";
import type { Customer } from "@/types/customer";

export const customerService = {
  async findBySupabaseUserId(supabaseUserId: string): Promise<Customer | null> {
    try {
      const { data } = await api.get<Customer>(
        `/customers/by-supabase-user/${supabaseUserId}`,
      );
      return data;
    } catch {
      return null;
    }
  },

  async create(customer: Partial<Customer>): Promise<Customer> {
    const { data } = await api.post<Customer>("/customers", customer);
    return data;
  },

  async syncWithSupabase(
    supabaseUserId: string,
    name: string,
  ): Promise<Customer> {
    const existing = await this.findBySupabaseUserId(supabaseUserId);
    if (existing) {
      return existing;
    }
    return this.create({
      supabase_user_id: supabaseUserId,
      name,
    });
  },
};

