/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from "@mui/material";
import { UserProps } from "./ConversationNavbar";
import { useState } from "react";
export type ConversationChatProps = {
  user: Partial<UserProps>;
};

export const ConversationChat = ({ user }: ConversationChatProps) => {
  const [currentAuthor, setCurrentAuthor] = useState<string | null>(null);
  function formatTimestamp(timestamp: number) {
    const messageDate = new Date(timestamp);

    const day = String(messageDate.getDate()).padStart(2, "0");
    const month = String(messageDate.getMonth() + 1).padStart(2, "0");
    const year = messageDate.getFullYear();

    const hours = String(messageDate.getHours()).padStart(2, "0");
    const minutes = String(messageDate.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  const timestamp = Date.now();
  const formattedTime = formatTimestamp(timestamp);

  const { username, messages } = user;
  return (
    <>
      {messages?.map((message) => (
        <>
          <Box
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
                  {username}
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
                {message}
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
