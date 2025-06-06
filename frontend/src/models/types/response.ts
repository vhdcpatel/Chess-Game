import { UserInfo } from '../../features/auth/authTypes';

export interface AuthResponse {
  token: string;
  user: UserInfo;
}