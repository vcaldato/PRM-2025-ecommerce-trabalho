export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

