import { Box, TextField, Typography, colors } from "@mui/material";
import users from "../../users.json";
import { ConversationSidebarItem } from "./ConversationSidebarItem";
export const SidebarSearchBar = () => {
  return (
    <>
      <TextField
        InputLabelProps={{
          style: { color: "lightgrey", fontWeight: "normal", fontSize: '14px' },
        }}
        id="filled-search"
        label="Search for conversation..."
        type="search"
        variant="filled"
        sx={{
          borderRadius: "5px",
          backgroundColor: "#808080",
          border: "none",
          overflow: "hidden",
          width: '250px',
          height: '50px'
        }}
      >
        Search user...
      </TextField>
    </>
  );
};
