import React, { ReactNode } from "react";
import { AuthProvider } from "./authContext/authContext";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <>
        <AuthProvider>
          {children}
        </AuthProvider>
    </>
  )
}

export default AppProvider;