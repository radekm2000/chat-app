import users from "../../users.json";
import { Box, Typography, styled } from "@mui/material";
import SidebarNavbar from "../sidebar/SidebarNavbar";
import { SidebarSearchBar } from "../sidebar/SidearSearchbar";
import { SidebarItem } from "../sidebar/ConversationSidebarItem";
export const ConversationSidebar = () => {
  return (
    <Box sx={{backgroundColor: '#151515'}}>
      <SidebarNavbar />
      <SidebarItem/>
    </Box>
  );
};
