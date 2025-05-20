export interface UserInfo {
  id: string;
  name: string;
  rating: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  authToken: string | null;
}