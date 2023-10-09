import { UserType } from "../components/conversations/ConversationNavbar";

export const getRecipientFromConversation = (
  conversation?: any,
  username: string
) => {
  return username === conversation?.creator.username
    ? conversation?.recipient
    : conversation?.creator;
};
