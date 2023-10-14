import { createContext, useState, ReactNode } from "react";

export const ChatContext = createContext({});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatMessages, setChatMessages] = useState([]);

  return (
    <ChatContext.Provider value={{ chatMessages, setChatMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
