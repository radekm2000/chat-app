/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { formatTimestamp } from "../../utils/formatTimestamp";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import { useQuery } from "@tanstack/react-query";
import { useAxiosAuthorized } from "../../hooks/useAxiosAuthorized";
import { useUser } from "../../hooks/useUser";
import { useSocket } from "../../hooks/useSocket";
import { useChatMsg } from "../../hooks/useChatMsg";
import { Conversation, UserType } from "../../types/types";
export type ConversationChatProps = {
  user: Partial<UserType>;
  isUserDataLoading: boolean;
  isConversationDataLoading: boolean;
  conversation: Conversation;
  userImage: string;
};

export const ConversationChat = ({
  user,
  isUserDataLoading,
  isConversationDataLoading,
  conversation,
  userImage,
}: ConversationChatProps) => {
  //me user is radek (username)
  const { meUser } = useUser();
  const [meUserImage, setMeUserImage] = useState("");
  const divRef = useRef<null | HTMLDivElement>(null);
  const socket = useSocket();
  const { chatMessages, setChatMessages } = useChatMsg();
  console.log(chatMessages);

  useEffect(() => {
    socket.on("getMessage", (msg) => {
      console.log("otrzymany event getMessage");
      if (conversation.id !== msg.conversation?.id) return;
      console.log("otrzymana wiadomosc z socketa");
      console.log(msg);
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("getMessage");
    };
  });

  const { data: meUserImageData } = useQuery({
    queryKey: ["user/avatar"],
    queryFn: async () => {
      const response = await axiosAuthorized.get("avatars/avatar");
      return response.data;
    },
  });
  useEffect(() => {
    if (meUserImageData) {
      setMeUserImage(meUserImageData);
    }
  }, [meUserImageData, meUserImage]);

  useEffect(() => {
    divRef?.current?.scrollIntoView({ behavior: "instant" });
  });

  const axiosAuthorized = useAxiosAuthorized();
  console.log(conversation);
  const { data, isLoading } = useQuery({
    queryKey: ["conversation/messages", conversation?.id],
    queryFn: async () => {
      const response = await axiosAuthorized.post("messages/conversation", {
        conversationId: conversation?.id,
      });
      setChatMessages(response?.data);
      return response.data;
    },
  });
  if (isLoading) {
    return <div>isLoading...</div>;
  }
  console.log(`pobrane wiadomosci z konwersacji o id: ${conversation?.id}`);
  console.log(data);
  console.log(meUser);
  console.log("chat messages");
  console.log(chatMessages);
  return (
    <>
      {chatMessages?.map((message, index) => {
        const isMyMessage = message?.author?.username === meUser;

        const imageToShow = isMyMessage ? meUserImage : userImage;

        return (
          <Box
            key={message.id}
            sx={{
              padding: "13px",
              gap: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {index === 0 ||
            chatMessages[index - 1]?.author?.id !==
              chatMessages[index]?.author?.id ? (
              <>
                {imageToShow ? (
                  <Box
                    component="img"
                    key={`${index}-avatar`}
                    sx={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      display: "flex",
                    }}
                    src={imageToShow}
                  ></Box>
                ) : (
                  <AccountCircleRoundedIcon
                    sx={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      color: "white",
                    }}
                  />
                )}
                <Box key={`${index}-username`}>
                  <Typography
                    component="span"
                    fontFamily={"Arial"}
                    sx={{
                      fontSize: "23px",
                      fontWeight: "500",
                      color: "white",
                      display: "flex",
                    }}
                  >
                    <>
                      {message?.author?.username === meUser
                        ? meUser
                        : user?.username}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "12px",
                          color: "#A3A3A3",
                          alignSelf: "center",
                          marginLeft: "10px",
                        }}
                      >
                        {formatTimestamp(Date.parse(message.createdAt))}
                      </Typography>
                    </>
                  </Typography>
                  <Typography
                    component={"span"}
                    key={`${index}-MsgContent`}
                    sx={{ fontSize: "18px", color: "#A3A3A3" }}
                  >
                    {message.content}
                    <Typography ref={divRef}></Typography>
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography
                component={"span"}
                key={`${index}-plainMsgContent`}
                sx={{
                  fontSize: "18px",
                  color: "#A3A3A3",
                  marginLeft: "55px",
                  marginTop: "-25px",
                }}
              >
                {message.content}
                <Typography ref={divRef}></Typography>
              </Typography>
            )}
          </Box>
        );
      })}
    </>
  );
};
