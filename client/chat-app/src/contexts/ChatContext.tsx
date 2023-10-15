import { createContext, useState, ReactNode } from "react";

export const ChatContext = createContext({});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  return (
    <ChatContext.Provider
      value={{ chatMessages, setChatMessages, notifications, setNotifications }}
    >
      {children}
    </ChatContext.Provider>
  );
};
