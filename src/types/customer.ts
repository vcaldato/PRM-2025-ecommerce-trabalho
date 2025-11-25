export interface Customer {
  id: string;
  name: string;
  adress?: string;
  zipcode?: string;
  supabase_user_id?: string;
  state?: {
    id: string;
    name: string;
  };
}

