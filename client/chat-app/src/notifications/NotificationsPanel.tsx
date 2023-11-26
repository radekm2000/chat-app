import { Box } from "@mui/material";
import { NotificationsFriendList } from "./NotificationsFriendList";
import NotificationsNavbar from "./NotificationsNavbar";
import { NotificationsSidebar } from "./NotificationsSidebar";

export const NotificationsPanel = () => {
  return (
    <>
      <NotificationsNavbar />
      <NotificationsSidebar />
      <NotificationsFriendList />
    </>
  );
};
