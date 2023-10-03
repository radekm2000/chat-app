import { Box, Typography } from "@mui/material";
import { SearchBarResponse } from "../../../types/types";

export const SidebarSearchbarResponseWindow = ({ data, isLoading }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e1e",
      }}
    >
      {isLoading && <Typography>Loading...</Typography>}
      {data &&
        data.map((user) => (
          <Box 
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderBottom: "1px solid rgb(40, 40,40)",
              ":hover": {
                backgroundColor: "rgb(40, 40,40)",
                opacity: "0.8",
                borderRadius: "2%",
              },
              width: "250px",
              maxHeight: "200px",
              marginTop: "10px",
              marginBottom: "2px",
              marginLeft: "25px",
            }}
          >
            <Box
              sx={{
                width: "32px",
                height: "32px",
                backgroundColor: "blue",
                borderRadius: "50%",
              }}
            ></Box>
            <Box key={user.id}>
              <Typography
                fontFamily={"Readex Pro"}
                fontSize={"16px"}
                color={"white"}
              >
                {user.username}
              </Typography>
            </Box>
          </Box>
        ))}
    </Box>
  );
};
