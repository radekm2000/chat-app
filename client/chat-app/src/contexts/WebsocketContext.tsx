import { createContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
const accessToken = localStorage.getItem('token')
// eslint-disable-next-line react-refresh/only-export-components
export const socket = io("http://localhost:3000",{
  extraHeaders: {
    Authorization: `Bearer ${accessToken}`
  },
  withCredentials: true,
  autoConnect: false
})

export const WebsocketContext = createContext<Socket>(socket);


export const WebsocketProvider = WebsocketContext.Provider
