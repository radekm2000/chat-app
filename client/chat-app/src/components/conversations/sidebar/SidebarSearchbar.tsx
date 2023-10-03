/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAxiosAuthorized } from "../../../hooks/useAxiosAuthorized";
import { SearchBarResponse } from "../../../types/types";
import { SidebarSearchbarResponseWindow } from "./SidebarSearchbarResponseWindow";
import axios from "axios";
import { useDebounce } from "../../../hooks/useDebounce";
export const SidebarSearchBar = () => {
  const [searchBarValue, setSearchBarValue] = useState("");
  const axiosAuthorized = useAxiosAuthorized();
  const debouncedSearchTerm = useDebounce(searchBarValue, 500);
  const { data, isLoading, error } = useQuery({
    queryKey: ["users/search", debouncedSearchTerm],
    queryFn: async () => {
      if (debouncedSearchTerm) {
        const response = await axiosAuthorized.get(
          `users/search?query=${debouncedSearchTerm}`
        );
        return response.data;
      }

      return [];
    },
  });

  console.log(data);

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          width: "400px",
          display: "flex",
          marginLeft: "-30px",
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
