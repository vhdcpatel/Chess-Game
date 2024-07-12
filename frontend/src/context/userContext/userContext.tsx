import React, { createContext, ReactNode, useContext, useState } from "react";

interface userInfo {
  name: string | null;
  email: string | null;
  isLogged: boolean;
  isDarkMode: boolean;
}

interface userContextType {
  user: userInfo | null;
  setUser: React.Dispatch<React.SetStateAction<userInfo | null>>;
}

const UserContext = createContext<userContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<userInfo | null>(null);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
};

export const useUser = ():userContextType =>{
  const context = useContext(UserContext);
  
  if(context === undefined){
    throw new Error("useUser must be used within an UserProvider");
  }

  return context;
}