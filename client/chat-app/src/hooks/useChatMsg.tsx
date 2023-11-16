import { useContext } from "react";
import { ChatContext } from "../contexts/ChatContext";

export const useChatMsg = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat Context must be used within ChatContextProvider");
  }
  return context;
};
