/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAxiosAuthorized } from "../../../hooks/useAxiosAuthorized";
export const SidebarSearchBar = () => {
  const [searchBarValue, setSearchBarValue] = useState("");
  const axiosAuthorized = useAxiosAuthorized();
  // console.log(auth);
  const { data } = useQuery(["users/search", searchBarValue], async () => {
    if (searchBarValue.trim() === "") {
      return []; // Pusta lista, gdy nie ma wprowadzonego zapytania
    }
    try {
      const response = await axiosAuthorized.get(`users/search?query=${searchBarValue}`, {
      });
      console.log(response)
      return response.data
    } catch (error) {
      return
    }

  });
  console.log(data)

  return (
    <>
      <TextField
        inputProps={{ spellCheck: "false" }}
        InputLabelProps={{
          style: { color: "lightgrey", fontWeight: "normal", fontSize: "12px" },
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
    </>
  );
};
