import { createContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

export const socket = io({
  withCredentials: true,
  extraHeaders: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJyYWRlayIsImlhdCI6MTY5NTM4NjU4NywiZXhwIjoxNjk1Mzg3NDg3fQ.BpIPjh83GE9q89VBDEHsDl17LgXHzQpOq5_RF6WcngQ'}
});

export const WebsocketContext = createContext<Socket>(socket);


export const WebsocketProvider = ({children}: {children: ReactNode}) => {
    return(
        <WebsocketContext.Provider value={socket}>{children}</WebsocketContext.Provider>
    )
} 