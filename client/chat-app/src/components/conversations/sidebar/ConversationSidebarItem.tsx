/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from "@mui/material";
import users from "../../../users.json";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosAuthorized } from "../../../hooks/useAxiosAuthorized";
import { authApi, getAllUsers, getUserConversations } from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";
import { Redirect, useLocation } from "wouter";
import crypto from "crypto";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import { ConversationChannelPage } from "../ConversationChannelPage";
import { useRefreshToken } from "../../../hooks/useRefreshToken";
import { useSocket } from "../../../hooks/useSocket";
import useId from "@mui/material/utils/useId";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import { getRecipientFromConversation } from "../../../utils/getRecipientFromConversation";
import {
  Notification,
  OnlineUser,
  OnlineUsersType,
} from "../../../types/types";
import { useChatMsg } from "../../../hooks/useChatMsg";
import { NotificationPanel } from "../../NotificationPanel";
import { unreadNotificationsFunc } from "../../../utils/unreadNotifications";
type User = {
  id: string;
  username: string;
};

type UsersData = User[];

export const SidebarItem = ({ userChatId }) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const socket = useSocket();
  const [location, setLocation] = useLocation();
  const { auth } = useAuth();
  const { meUser } = useUser();
  const [authorTypingId, setAuthorTypingId] = useState(null);
  const axiosAuthorized = useAxiosAuthorized();
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);
  const { notifications, setNotifications } = useChatMsg();
  const [isChatOpen, setIsChatOpen] = useState(false);
  console.log("notifications: ", notifications);
  const markThisUserNotificationsAsRead = (
    thisUserNotifications: Notification[],
    notifications: Notification[]
  ) => {
    const mNotifications = notifications.map((el) => {
      let notification;

      thisUserNotifications.forEach((n) => {
        if (n.senderId === el.senderId) {
          notification = { ...n, isRead: true };
        } else {
          notification = el;
        }
      });
      return notification;
    });
    setNotifications(mNotifications);
  };



  useEffect(() => {
    socket.on("getNotification", (res) => {
      console.log(res);
      console.log("isChatOpen");

      const isChatOpen = userChatId
        ? parseInt(userChatId) === res.senderId
        : false;
      console.log(isChatOpen);
      console.log("sender id", res?.senderId);
      console.log("userChatId: ", userChatId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
        setIsChatOpen(true);
      } else {
        setNotifications((prev) => [...prev, res]);
      }
    });
    return () => {
      socket.off("getNotification");
    };
  });

  useEffect(() => {
    console.log("is typing : ");
    console.log(isTyping);
  }, [isTyping]);

  useEffect(() => {
    socket.on("typingMessage", ({ typingMsg, authorId, conversationId }) => {
      data.map((conversation) => {
        if (conversation?.id === conversationId) {
          setAuthorTypingId(authorId);
          setIsTyping(true);
        } else return;
      });
    });

    socket.on("noLongerTypingMessage", () => {
      console.log("user is no longer typing mesage");
      setIsTyping(false);
    });

    return () => {
      socket.off("noLongerTypingMessage");
      socket.off("typingMessage");
    };
  });
  // const { data } = useQuery<UsersData>({
  //   queryKey: ["users"],
  //   queryFn: getAllUsers,
  // });

  useEffect(() => {
    socket.on("getOnlineUsers", (onlineUsers: OnlineUser[]) => {
      setOnlineUsers(onlineUsers);
    });
    console.log(`online uzytkownicy`);
    console.log(onlineUsers);

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [onlineUsers, socket]);
  const handleUserChatClick = async (userId: string) => {
    setLocation(`/conversations/${userId}`);
  };
  const { data } = useQuery({
    queryKey: ["conversations"],
    queryFn: getUserConversations,
  });

  socket.on("getOnlineUsers", (onlineUsers: OnlineUser[]) => {
    setOnlineUsers(onlineUsers);
  });

  console.log(data);
  const recipients =
    data?.map((conversation) => {
      const recipient = getRecipientFromConversation(conversation, meUser);
      const { lastMessageSent, lastMessageSentAt } = conversation;
      return {
        username: recipient.username,
        lastMessageSent,
        lastMessageSentAt,
        id: recipient.id,
      };
    }) || [];
  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter((notification) => {
    return recipients.some(
      (recipient) => recipient.id === notification.senderId
    );
  });

  console.log("this user notifications: ", thisUserNotifications);
  const sortedRecipients = [...recipients].sort((a, b) => {
    const dateA = new Date(b.lastMessageSentAt).getTime();
    const dateB = new Date(a.lastMessageSentAt).getTime();
    const differenceInMilliseconds = dateA - dateB;
    return differenceInMilliseconds;
  });
  console.log(sortedRecipients);
  console.log(recipients);
  //sorted recipients is an array of objects that have properties :
  // username, lastMessageSent,lastMessageSentAt, id

  // const { data } = useQuery<UsersData>(["users/get"], async () => {
  //   try {
  //     const response = await axiosAuthorized.get("users");
  //     return response.data;
  //   } catch (error) {
  //     return;
  //   }
  // });
  return (
    <>
      {sortedRecipients &&
        sortedRecipients?.map((recipient) => {
          const recipientNotifications = thisUserNotifications?.filter(
            (notification) => notification.senderId === recipient.id
          );
          return (
            <Box
              key={recipient.id}
              sx={{
                padding: "13px 0px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                borderBottom: "1px solid rgb(40, 40,40)",
                ":hover": {
                  backgroundColor: "rgb(40, 40,40)",
                  opacity: "0.8",
                  borderRadius: "2%",
                },
              }}
              onClick={() => {
                handleUserChatClick(recipient.id);
                if (thisUserNotifications.length !== 0) {
                  markThisUserNotificationsAsRead(
                    thisUserNotifications,
                    notifications
                  );
                }
              }}
            >
              
              <Box
                key={`${recipient.id}a`}
                sx={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "blue",
                  borderRadius: "50%",
                  position: "relative",
                }}
              >
                {onlineUsers.some(
                  (onlineUser) => onlineUser?.userId === recipient?.id
                ) ? (
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#0DE638",
                      borderRadius: "50%",
                      position: "absolute",
                      bottom: "2px",
                      right: "3px",
                    }}
                  ></Box>
                ) : null}
              </Box>
              <Box key={`${recipient.id}b`}>
                <Typography
                  fontFamily={"Readex pro"}
                  sx={{
                    fontSize: "23px",
                    fontWeight: "500",
                    color: "white",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {recipientNotifications.length > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        right: -30,
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#27A68D",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold" }}>
                        {recipientNotifications.length}
                      </Typography>
                    </Box>
                  )}
                  {recipient.username}
                </Typography>
                {/* <Typography sx={{ fontSize: "14px", color: "#A3A3A3" }}>
                {recipient?.lastMessageSent?.content.length > 20
                  ? recipient?.lastMessageSent?.content.slice(0, 25) + "..."
                  : recipient?.lastMessageSent?.content || "testowa wiadomosc"}
              </Typography> */}
                <Typography sx={{ fontSize: "14px", color: "#A3A3A3" }}>
                  {isTyping && recipient.id === authorTypingId
                    ? "is typing..."
                    : recipient?.lastMessageSent?.content.length > 20
                    ? recipient?.lastMessageSent?.content.slice(0, 25) + "..."
                    : recipient?.lastMessageSent?.content || null}
                </Typography>
              </Box>
            </Box>
          );
        })}
    </>
  );
};
