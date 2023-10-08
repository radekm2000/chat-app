/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { UserType } from "./ConversationChannelPage";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { ConversationProps } from "./ConversationInputPanel";
import { useQuery } from "@tanstack/react-query";
import { useAxiosAuthorized } from "../../hooks/useAxiosAuthorized";
export type ConversationChatProps = {
  user: Partial<UserType>;
  isUserDataLoading: boolean
  isConversationDataLoading: boolean
  conversation: any;
};

export const ConversationChat = ({ user, isUserDataLoading, isConversationDataLoading, conversation }: ConversationChatProps) => {
  const [currentAuthor, setCurrentAuthor] = useState<string | null>(null);
  const timestamp = Date.now();
  const axiosAuthorized = useAxiosAuthorized()
  const formattedTime = formatTimestamp(timestamp);
  console.log(conversation);
  const {data, isLoading} = useQuery({
    queryKey: ['conversation/messages'],
    queryFn: async() => {
      const response = await axiosAuthorized.post('messages/conversation', {conversationId: conversation.id})
      return response.data
    },
  })
  if(isLoading) {
    console.log('wiadomosci się ładują')
  }
  console.log(`pobrane wiadomosci z konwersacji o id: ${conversation?.id}`)
  console.log(data)
  // const { username, messages } = user;
  return (
    <>
      {conversation?.messages?.map((message) => (
        <>
          <Box key={message.id}
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
                  {user?.username}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "12px",
                      color: "#A3A3A3",
                      alignSelf: "center",
                      marginLeft: "10px",
                    }}
                  >
                    {formattedTime}
                  </Typography>
                </>
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#A3A3A3" }}>
                {message.content}
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
