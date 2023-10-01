import { Box } from "@mui/material";
import { SidebarSearchBar } from "./SidebarSearchbar";

export const SidebarNavbar = () => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        width: "400px",
        display: "flex",
        marginLeft: '-30px',
        padding: "24px 0px",
        alignItems: "center",
        justifyContent: "center",
        height: "50px",
        borderBottom: '1px solid rgb(40, 40,40)',
      }}
    >
      <SidebarSearchBar />
    </Box>
  );
};

export default SidebarNavbar;
