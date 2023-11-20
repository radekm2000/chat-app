import { UserType } from "../components/conversations/ConversationNavbar";
import { UserConversation } from "../hooks/useUserConversations";

export const getRecipientFromConversation = (
  conversation: UserConversation,
  username: string
) => {
  return username === conversation?.creator.username
    ? conversation?.recipient
    : conversation?.creator;
};
