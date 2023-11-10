import { Box } from "@mui/material";
import { SidebarItem } from "./sidebar/ConversationSidebarItem";
import { SidebarSearchBar } from "./sidebar/SidebarSearchbar";
export const ConversationSidebar = ({ userChatId }) => {
  return (
    <Box>
      <SidebarSearchBar />
      <Box sx={{padding: '0px 30px'}}>
        <SidebarItem userChatId={userChatId} />
      </Box>
    </Box>
  );
};
