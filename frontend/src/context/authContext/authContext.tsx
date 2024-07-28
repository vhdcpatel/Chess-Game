import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { loginHandler, signupHandler } from '../../services/apis/auth';
import { LoginCallPayLoad, SingUpCallPayLoad } from '../../utils/types/payloads';
import { UserInfo } from '../../utils/types/response';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (loginPayload: LoginCallPayLoad) => Promise<void>  
  signUp: (userInfo: SingUpCallPayLoad) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  const login = async (loginPayload: LoginCallPayLoad) => {
    try {
      const response = await loginHandler(loginPayload);
      if(response.status !== 200 || !response.data.user ){
        throw new Error('Login failed');
      }
      const userData = response.data.user;
      const token = response.data.token;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signUp = async (userInfo: SingUpCallPayLoad) => {
    try {
      const response = await signupHandler(userInfo);

      if(response.status !== 201 || !response.data.user){
        throw new Error('Login failed');
      }
      const token = response.data.token;
      const userData = response.data.user;
      
      setIsAuthenticated(true);
      setUser(userData);
      
    } catch (error) {
      console.log(error);
      throw new Error('Signup failed');
    }
  };

  // Implement in the future.
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await axios.get('/api/auth/check'); // Your endpoint to check auth
  //       setAuthState({
  //         isAuthenticated: true,
  //         user: response.data.user,
  //       });
  //     } catch (error) {
  //       setAuthState({
  //         isAuthenticated: false,
  //         user: null,
  //       });
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signUp, logout }}>
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