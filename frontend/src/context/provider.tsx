import React, { ReactNode } from "react";
import { AuthProvider } from "./authContext/authContext";
import { SocketProvider } from "./authContext/SocketContext";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <>
        <AuthProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </AuthProvider>
    </>
  )
}

export default AppProvider;