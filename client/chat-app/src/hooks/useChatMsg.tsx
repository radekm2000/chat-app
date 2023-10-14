import { useContext } from "react";
import { ChatContext } from "../contexts/ChatContext";

export const useChatMsg = () => {
  return useContext(ChatContext);
};
