import { useQuery } from "@tanstack/react-query";
import { useAxiosAuthorized } from "./useAxiosAuthorized";
import { ConversationUser, LastMessageSent, Message } from "../types/types";


export type UserConversation = {
    createdAt: string;
    creator: ConversationUser
    id: number;
    lastMessageSent: LastMessageSent;
    lastMessageSentAt: string;
    recipient: ConversationUser
    messages: Message[]  
}

export const useUserConversations = () => {
  const axiosAuthorized = useAxiosAuthorized();
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await axiosAuthorized.get("conversations");
      return data as UserConversation[]
    },
  });
};
