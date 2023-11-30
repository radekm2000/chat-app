import { Box, Typography } from "@mui/material";
import { unreadNotificationsFunc } from "../utils/unreadNotifications";
import { useChatMsg } from "../hooks/useChatMsg";

export const NotificationPanel = () => {
  const { notifications } = useChatMsg();
  const unreadNotifications = unreadNotificationsFunc(notifications);
  return (
    <Box
      sx={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "#27A68D",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {unreadNotifications.length === 0 ? null : (
        <Typography sx={{ color: "#1B21E4", fontSize: "15px", fontWeight: 'bold' }}>
          {unreadNotifications?.length}
        </Typography>
      )}
    </Box>
  );
};
