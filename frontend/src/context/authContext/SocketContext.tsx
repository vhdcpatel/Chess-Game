import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./authContext";

// take from vite env
const SocketURL = import.meta.env.VITE_SOCKET_URL as string ?? 'http://localhost:5000';

interface ISocketContext {
  socket: Socket | null;
}

const SocketContext = createContext<ISocketContext>({ socket: null });

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const { isAuthenticated, authToken } =useAuth();
  const socket = useRef<Socket | null>(null);

  useEffect(()=>{
    if(isAuthenticated){
      socket.current = io(SocketURL, {
        withCredentials: true,
        auth:{
          // Latter also implement for get auth token from local storage
          token: authToken
        }
      })

      return ()=>{
        if(socket.current){
          socket.current.disconnect();
        }
      }
    }
  },[])



  return (
    <SocketContext.Provider value={{ socket:  socket.current}}>
      {children}
    </SocketContext.Provider>
  )
}
const useSocket = (): ISocketContext => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('socketContext must be used within an AuthProvider');
  }
  return context;
}

export default useSocket;
