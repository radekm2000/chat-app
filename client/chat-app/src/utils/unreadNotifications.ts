import { Notification } from "../types/types";

export const unreadNotificationsFunc = (notifications: Notification[]) => {
  return notifications.filter((n) => n.isRead === false)
};
