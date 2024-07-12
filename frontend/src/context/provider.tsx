import React, { ReactNode } from "react";
import { UserProvider } from "./userContext/userContext";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <>
      <UserProvider>
        {children}
      </UserProvider>
    </>
  )
}

export default AppProvider;