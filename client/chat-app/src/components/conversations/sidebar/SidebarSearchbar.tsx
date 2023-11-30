/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { SidebarSearchbarResponseWindow } from "./SidebarSearchbarResponseWindow";
import { useSearchbarUsersQuery } from "../../../hooks/useSearchbarUsersQuery";
export const SidebarSearchBar = () => {
  const [searchBarValue, setSearchBarValue] = useState("");

  const { data, isLoading } = useSearchbarUsersQuery(searchBarValue);
  return (
    <>
      <Box
        sx={{
          position: "sticky",
          width: "400px",
          display: "flex",
          padding: "24px 0px",
          alignItems: "center",
          justifyContent: "center",
          height: "50px",
          borderBottom: "1px solid rgb(40, 40,40)",
        }}
      >
        <TextField
          value={searchBarValue}
          inputProps={{ spellCheck: "false" }}
          InputLabelProps={{
            style: {
              color: "lightgrey",
              fontWeight: "normal",
              fontSize: "12px",
            },
          }}
          id="filled-search"
          label="Search for conversation..."
          type="search"
          onChange={(e) => setSearchBarValue(e.currentTarget.value)}
          variant="filled"
          sx={{
            borderRadius: "5px",
            backgroundColor: "#808080",
            border: "none",
            overflow: "hidden",
            width: "250px",
            height: "50px",
          }}
        >
          Search user...
        </TextField>
      </Box>
      <Box>
        {data && (
          <SidebarSearchbarResponseWindow data={data} isLoading={isLoading} />
        )}
      </Box>
    </>
  );
};
