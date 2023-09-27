import { Box } from "@mui/material";
import SidebarNavbar from "./sidebar/SidebarNavbar";
import { SidebarItem } from "./sidebar/ConversationSidebarItem";
export const ConversationSidebar = () => {
  return (
    <Box sx={{padding: '0px 30px'}}>
      <SidebarNavbar/>
      <SidebarItem/>
    </Box>
  );
};
