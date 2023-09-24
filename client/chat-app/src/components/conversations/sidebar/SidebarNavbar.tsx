import { Box } from "@mui/material";
import { SidebarSearchBar } from "./SidearSearchbar";

export const SidebarNavbar = () => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        width: "400px",
        display: "flex",
        padding: "12px",
        alignItems: "center",
        justifyContent: "center",
        height: "50px",
        borderBottom: "1px solid white",
        backgroundColor: "#424242",
      }}
    >
      <SidebarSearchBar />
    </Box>
  );
};

export default SidebarNavbar;
