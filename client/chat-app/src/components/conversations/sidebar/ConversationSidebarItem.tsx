/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from "@mui/material";
import users from "../../../users.json";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosAuthorized } from "../../../hooks/useAxiosAuthorized";
import { authApi, getAllUsers, getUserConversations } from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";
import { Redirect, useLocation } from "wouter";
import crypto from "crypto";

import { ConversationChannelPage } from "../ConversationChannelPage";
import { useRefreshToken } from "../../../hooks/useRefreshToken";
import { useSocket } from "../../../hooks/useSocket";
import useId from "@mui/material/utils/useId";
import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import { getRecipientFromConversation } from "../../../utils/getRecipientFromConversation";
import { OnlineUser, OnlineUsersType } from "../../../types/types";
type User = {
  id: string;
  username: string;
};

type UsersData = User[];

export const SidebarItem = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const socket = useSocket();
  const [location, setLocation] = useLocation();
  const { auth } = useAuth();
  const { meUser } = useUser();
  const axiosAuthorized = useAxiosAuthorized();
  const queryClient = useQueryClient();
  // const { data } = useQuery<UsersData>({
  //   queryKey: ["users"],
  //   queryFn: getAllUsers,
  // });

  useEffect(() => {
    socket.on("getOnlineUsers", (onlineUsers: OnlineUser[]) => {
      setOnlineUsers(onlineUsers);
    });
    console.log(`online uzytkownicy`)
    console.log(onlineUsers)

    return () => {
      socket.off('getOnlineUsers')
    }
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
    <Box>
      {sortedRecipients &&
        sortedRecipients?.map((recipient) => (
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
            onClick={() => handleUserChatClick(recipient.id)}
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
                sx={{ fontSize: "23px", fontWeight: "500", color: "white" }}
              >
                {recipient.username}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#A3A3A3" }}>
                {recipient?.lastMessageSent?.content.length > 20 ? recipient?.lastMessageSent?.content.slice(0,25) + '...' : recipient?.lastMessageSent?.content || "testowa wiadomosc"}
              </Typography>
            </Box>
          </Box>
        ))}
    </Box>
  );
};
