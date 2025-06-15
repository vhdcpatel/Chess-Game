import React, { createContext, useState, useContext, ReactNode } from 'react';
import { loginHandler, signupHandler } from '../../services/apis/auth';
import { LoginCallPayLoad, SingUpCallPayLoad } from '../../models/types/payloads';
import { UserInfo } from '../../features/auth/authTypes';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (loginPayload: LoginCallPayLoad) => Promise<void>;  
  signUp: (userInfo: SingUpCallPayLoad) => Promise<void>;
  logout: () => void;
  authToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const login = async (loginPayload: LoginCallPayLoad) => {
    try {
      const response = await loginHandler(loginPayload);
      if(response.status !== 200 || !response.data.user ){
        throw new Error('Login failed');
      }
      const userData = response.data.user;
      const token = response.data.authToken;
      setAuthToken(token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(error+'Login failed');
    }
  };

  const signUp = async (userInfo: SingUpCallPayLoad) => {
    try {
      const response = await signupHandler(userInfo);

      if(response.status !== 201 || !response.data.user){
        throw new Error('Login failed');
      }
      const token = response.data.authToken
      const userData = response.data.user;

      setAuthToken(token);
      setIsAuthenticated(true);
      setUser(userData);
      
    } catch (error) {
      console.log(error);
      throw new Error(error+'SignUp failed');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signUp, logout, authToken}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};