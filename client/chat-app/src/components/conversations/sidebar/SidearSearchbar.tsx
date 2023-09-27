import {TextField} from "@mui/material";
export const SidebarSearchBar = () => {
  return (
    <>
      <TextField
        InputLabelProps={{
          style: { color: "lightgrey", fontWeight: "normal", fontSize: '12px' },
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
