/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { UserType } from "./ConversationChannelPage";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { ConversationProps } from "./ConversationInputPanel";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosAuthorized } from "../../hooks/useAxiosAuthorized";
import { useUser } from "../../hooks/useUser";
export type ConversationChatProps = {
  user: Partial<UserType>;
  isUserDataLoading: boolean;
  isConversationDataLoading: boolean;
  conversation: any;
};

export const ConversationChat = ({
  user,
  isUserDataLoading,
  isConversationDataLoading,
  conversation,
}: ConversationChatProps) => {
  const { meUser } = useUser();
  const [currentAuthor, setCurrentAuthor] = useState<string | null>(null);
  const timestamp = Date.now();
  const queryClient = useQueryClient();
  const divRef = useRef(null)

  useEffect(() => {
    divRef?.current?.scrollIntoView({behavior: 'instant'})
  })
  // useEffect(() => {
  //   ref.current?.scrollIntoView({behavior:"sharp"})
  // }, [message?.content])
  const axiosAuthorized = useAxiosAuthorized();
  const formattedTime = formatTimestamp(timestamp);
  console.log(conversation);
  const { data, isLoading } = useQuery({
    queryKey: ["conversation/messages", conversation?.id],
    queryFn: async () => {
      const response = await axiosAuthorized.post("messages/conversation", {
        conversationId: conversation?.id,
      });
      return response.data;
    },
  });
  if (isLoading) {
    return <div>isLoading...</div>;
  }
  console.log(`pobrane wiadomosci z konwersacji o id: ${conversation?.id}`);
  console.log(data);
  console.log(meUser);
  console.log("autor wiadomosci");
  data?.map((message) => {
    console.log(message?.author?.username);
  });

  //each message has props: author = {id, username, }, content, createdAt, id
  // const { username, messages } = user;
  // can check who the message belongs to

  //data?.map((message) => (
  // key = message.id  message?.author?.username === meUser ? meUser : user?.username
  //))
  return (
    <>
      {data?.map((message) => (
        <>
          <Box
            key={message.id}
            sx={{
              padding: "13px",
              gap: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "48px",
                height: "48px",
                backgroundColor: "white",
                borderRadius: "50%",
                display: "flex",
              }}
            ></Box>
            <Box>
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
              <Typography sx={{ fontSize: "18px", color: "#A3A3A3" }}>
                {message.content}
                <div ref={divRef}></div>
              </Typography>
            </Box>
          </Box>
        </>
      ))}
    </>
  );
};

//dodanie profilowego do osoby co pisze nowa wiadomosc
// // {messages?.map((message, index) => (
//     <>
//     {index === 0 || messages[index - 1]?.author !== messages[index]?.author ? (
//       // Jeśli to pierwsza wiadomość od autora lub zmiana autora, wyświetl zdjęcie
//       <Box
//         key={index + "_avatar"}
//         sx={{
//           width: "48px",
//           height: "48px",
//           backgroundColor: "white",
//           borderRadius: "50%",
//           display: "flex",
//           // Tutaj możesz dodać styl do obrazka użytkownika
//         }}
//       ></Box>
//     ) : null}
