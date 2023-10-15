import { Box } from "@mui/material";
import { SidebarItem } from "./sidebar/ConversationSidebarItem";
import { SidebarSearchBar } from "./sidebar/SidebarSearchbar";
export const ConversationSidebar = ({userChatId}) => {
  return (
    <Box sx={{padding: '0px 30px'}}>
      <SidebarSearchBar/>
      <SidebarItem userChatId={userChatId}/>
    </Box>
  );
};
