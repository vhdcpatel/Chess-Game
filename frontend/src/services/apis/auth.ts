import { AxiosResponse } from 'axios';
import { AuthResponse } from '../../utils/types/response';
import api from './api';
import { LoginCallPayLoad, singUpCallPayLoad } from '../../utils/types/payloads';

export const loginHandler = async (loginPayLoad: LoginCallPayLoad): Promise<AxiosResponse<AuthResponse>> => {
  return api.post<AuthResponse>('/login', loginPayLoad);
};

export const signupHandler = async (signPayload: singUpCallPayLoad): Promise<AxiosResponse<AuthResponse>> => {
  return api.post<AuthResponse>('/signup', signPayload);
};