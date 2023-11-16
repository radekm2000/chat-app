import { createContext, useState, ReactNode } from "react";
import { ChatMessage, Notification } from "../types/types";

export const ChatContext = createContext<ChatContext>({});

type ChatContext = {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  return (
    <ChatContext.Provider
      value={{ chatMessages, setChatMessages, notifications, setNotifications }}
    >
      {children}
    </ChatContext.Provider>
  );
};
