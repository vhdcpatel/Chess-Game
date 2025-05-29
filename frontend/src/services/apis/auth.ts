import { AxiosResponse } from 'axios';
import { AuthResponse } from '../../models/types/response';
import api from './api';
import { LoginCallPayLoad, SingUpCallPayLoad } from '../../models/types/payloads';

export const loginHandler = async (loginPayLoad: LoginCallPayLoad): Promise<AxiosResponse<AuthResponse>> => {
  return api.post<AuthResponse>('/auth/login', loginPayLoad);
};

export const signupHandler = async (signPayload: SingUpCallPayLoad): Promise<AxiosResponse<AuthResponse>> => {
  return api.post<AuthResponse>('/auth/signup', signPayload);
};