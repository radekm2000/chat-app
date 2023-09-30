import { Box, Typography } from "@mui/material";

export const NotificationsPanel = () => {
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Typography
        fontFamily={"Readex Pro"}
        fontSize={"23px"}
        sx={{ color: "#fff" }}
      >
        No notifications
      </Typography>
    </Box>
  );
};
