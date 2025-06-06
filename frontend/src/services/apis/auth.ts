import api from './api';
import { AxiosResponse } from 'axios';
import { LoginCallPayLoad, SingUpCallPayLoad, AuthState } from '../../features/auth/authTypes';

export const loginHandler = async (loginPayLoad: LoginCallPayLoad): Promise<AxiosResponse<AuthState>> => {
  return api.post<AuthResponse>('/auth/login', loginPayLoad);
};

export const signupHandler = async (signPayload: SingUpCallPayLoad): Promise<AxiosResponse<AuthState>> => {
  return api.post<AuthResponse>('/auth/signup', signPayload);
};