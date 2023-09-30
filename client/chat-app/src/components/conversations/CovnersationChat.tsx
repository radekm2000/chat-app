import { Box, Typography } from "@mui/material";
import users from "../../users.json";
import { UserProps } from "./ConversationNavbar";
export type ConversationChatProps = {
  user: Partial<UserProps>;
};

export const ConversationChat = ({ user}: ConversationChatProps) => {
    const {id, username, lastMessage, messages} = user;
  return (
    <Box>
        {messages?.map((message, index) => (
            <Typography key={index}>{message}</Typography>
        ))}
    </Box>
  );
};
