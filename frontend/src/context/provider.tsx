import React, { ReactNode } from "react";
import { UserProvider } from "./userContext/userContext";
import { AuthProvider } from "./authContext/authContext";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <>
      <UserProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </UserProvider>
    </>
  )
}

export default AppProvider;