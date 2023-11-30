/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from "@mui/material";
import { Image } from "mui-image";

import { getAvatarById } from "../../../api/axios";
import { useLocation } from "wouter";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useSocket } from "../../../hooks/useSocket";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import { getRecipientFromConversation } from "../../../utils/getRecipientFromConversation";
import { Notification, OnlineUser, Recipient } from "../../../types/types";
import { useChatMsg } from "../../../hooks/useChatMsg";
import { unreadNotificationsFunc } from "../../../utils/unreadNotifications";
import { formatTimestampToSidebar } from "../../../utils/formatTimestampToSidebar";
import { useUserConversations } from "../../../hooks/useUserConversations";

export const SidebarItem = ({ userChatId }: { userChatId: string }) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const socket = useSocket();
  const [location, setLocation] = useLocation();
  const { meUser } = useUser();
  const [authorTypingId, setAuthorTypingId] = useState(null);
  const [ppl, setPpl] = useState<Array<Recipient>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const { notifications, setNotifications } = useChatMsg();
  const [isChatOpen, setIsChatOpen] = useState(false);
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
      return notification as unknown as Notification;
    });
    setNotifications(mNotifications);
  };

  useEffect(() => {
    socket.on("getNotification", (res) => {
      const isChatOpen = userChatId
        ? parseInt(userChatId) === res.senderId
        : false;
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

  useEffect(() => {}, [isTyping]);

  useEffect(() => {
    socket.on("typingMessage", ({ authorId, conversationId }) => {
      data?.map((conversation) => {
        if (conversation?.id === conversationId) {
          setAuthorTypingId(authorId);
          setIsTyping(true);
        } else return;
      });
    });

    socket.on("noLongerTypingMessage", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("noLongerTypingMessage");
      socket.off("typingMessage");
    };
  });
  useEffect(() => {
    socket.on("getOnlineUsers", (onlineUsers: OnlineUser[]) => {
      setOnlineUsers(onlineUsers);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [onlineUsers, socket]);
  const handleUserChatClick = async (userId: string) => {
    setLocation(`/conversations/${userId}`);
  };

  const { data } = useUserConversations();

  socket.on("getOnlineUsers", (onlineUsers: OnlineUser[]) => {
    setOnlineUsers(onlineUsers);
  });
  const recipients = useMemo(() => {
    return (
      data?.map((conversation) => {
        const recipient = getRecipientFromConversation(conversation, meUser);
        const { lastMessageSent, lastMessageSentAt } = conversation;
        return {
          username: recipient.username,
          lastMessageSent,
          lastMessageSentAt,
          id: recipient.id,
        };
      }) || []
    );
  }, [data, meUser]);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter((notification) => {
    return recipients?.some(
      (recipient) => recipient.id === notification.senderId
    );
  });

  const sortedRecipients = [...recipients].sort((a, b) => {
    const dateA = new Date(b.lastMessageSentAt).getTime();
    const dateB = new Date(a.lastMessageSentAt).getTime();
    const differenceInMilliseconds = dateA - dateB;
    return differenceInMilliseconds;
  });
  useEffect(() => {
    if (sortedRecipients.length === 0) {
      return;
    }
    const addAvatarsToRecipients = async (recipients) => {
      return Promise.all(
        recipients.map(async (recipient) => {
          const avatar = await getAvatarById(parseInt(recipient?.id));

          return {
            ...recipient,
            avatar,
          };
        })
      );
    };
    addAvatarsToRecipients(sortedRecipients)
      .then((sortedRecipientsWithAvatars) => {
        const updatedRecipients = sortedRecipients.map((recipient) => {
          const matchingAvatarRecipient = sortedRecipientsWithAvatars.find(
            (r) => r.id === recipient.id
          );
          if (matchingAvatarRecipient) {
            return { ...recipient, avatar: matchingAvatarRecipient.avatar };
          }
          return recipient;
        });
        setPpl(updatedRecipients);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [recipients]);

  return (
    <>
      {ppl &&
        ppl?.map((recipient) => {
          const recipientNotifications = thisUserNotifications?.filter(
            (notification) => notification.senderId === parseInt(recipient.id)
          );
          return (
            <Box
              key={recipient.id}
              sx={{
                cursor: "pointer",
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
                  position: "relative",
                }}
              >
                {recipient?.avatar ? (
                  <Image
                    src={recipient.avatar || ""}
                    alt="userAvatar"
                    width={48}
                    height={48}
                    style={{ borderRadius: "50%" }}
                    duration={0}
                  />
                ) : (
                  <AccountCircleRoundedIcon
                    sx={{ width: "48px", height: "48px", color: "white" }}
                  />
                )}
                {onlineUsers.some(
                  (onlineUser) => onlineUser?.userId === parseInt(recipient?.id)
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

                <Typography sx={{ fontSize: "14px", color: "#A3A3A3" }}>
                  {isTyping && recipient.id === authorTypingId
                    ? "is typing..."
                    : recipient?.lastMessageSent?.content.length > 20
                    ? recipient?.lastMessageSent?.content.slice(0, 25) + "..."
                    : recipient?.lastMessageSent?.content || null}
                  <span style={{ fontSize: "11px", paddingLeft: "5px" }}>
                    {formatTimestampToSidebar(
                      Date.parse(recipient?.lastMessageSentAt)
                    )}
                  </span>
                </Typography>
              </Box>
            </Box>
          );
        })}
    </>
  );
};
