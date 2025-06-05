// src/context/SocketProvider.jsx
import { useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}