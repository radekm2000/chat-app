import { createContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
const accessToken = localStorage.getItem("token");
// eslint-disable-next-line react-refresh/only-export-components
export const socket = io("http://localhost:3000", {
  extraHeaders: {
    Authorization: `Bearer ${accessToken}`,
  },
  withCredentials: true,
  autoConnect: false,
  reconnection: !0,
});

socket.on("error", async (error) => {
  if (error === "jwt_malformed") {
    const newToken = localStorage.getItem("token");
    if (socket.io.opts && socket.io.opts.extraHeaders) {
      socket.io.opts.extraHeaders.Authorization = `Bearer ${newToken}`;
    }
    console.log('reconnecting with new token')
    socket.connect();
  }
});


export const WebsocketContext = createContext<Socket>(socket);

export const WebsocketProvider = WebsocketContext.Provider;
