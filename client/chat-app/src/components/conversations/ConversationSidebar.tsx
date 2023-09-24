import { Box } from "@mui/material";
import SidebarNavbar from "./sidebar/SidebarNavbar";
import { SidebarItem } from "./sidebar/ConversationSidebarItem";
export const ConversationSidebar = () => {
  return (
    <Box sx={{backgroundColor: '#151515'}}>
      <SidebarNavbar  />
      <SidebarItem/>
    </Box>
  );
};
