export interface UserInfo {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
  error?: string;
}