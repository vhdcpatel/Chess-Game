import { AxiosResponse } from 'axios';
import { AuthResponse } from '../../utils/types/response';
import api from './api';
import { LoginCallPayLoad, SingUpCallPayLoad } from '../../utils/types/payloads';

export const loginHandler = async (loginPayLoad: LoginCallPayLoad): Promise<AxiosResponse<AuthResponse>> => {
  return api.post<AuthResponse>('/auth/login', loginPayLoad);
};

export const signupHandler = async (signPayload: SingUpCallPayLoad): Promise<AxiosResponse<AuthResponse>> => {
  return api.post<AuthResponse>('/auth/signup', signPayload);
};

export const startGame = async (payload={}): Promise<AxiosResponse<AuthResponse>> => {
  return api.post<AuthResponse>('/game/start',payload);
};

export const joinGame = async (payload:any): Promise<AxiosResponse<AuthResponse>> => {
  return api.post<AuthResponse>('/game/join',payload);
}
