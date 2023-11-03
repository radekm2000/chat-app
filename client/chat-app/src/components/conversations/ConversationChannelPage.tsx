import { Box, Typography } from "@mui/material";
import { ConversationNavbar } from "./ConversationNavbar";
import { ConversationInputPanel } from "./ConversationInputPanel";
import { ConversationChat } from "./ConversationChat";
import { useQuery } from "@tanstack/react-query";
import { useAxiosAuthorized } from "../../hooks/useAxiosAuthorized";
import { useUser } from "../../hooks/useUser";
import { useSocket } from "../../hooks/useSocket";
import { useChatMsg } from "../../hooks/useChatMsg";
import { useEffect, useState } from "react";
import { getAvatarById } from "../../api/axios";

export type UserType = {
  id: number;
  username: string;
  messages: [];
};
export const ConversationChannelPage = ({
  userChatId,
}: {
  userChatId: string;
}) => {
  const idToNum = parseInt(userChatId);
  const axiosAuthorized = useAxiosAuthorized();
  console.log(idToNum);
  const socket = useSocket();
  const { meUser } = useUser();
  const [avatarImage, setAvatarImage] = useState("");
  const { notifications, setNotifications } = useChatMsg();

  socket.on("getNotification", () => {});

  console.log(meUser);
  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["users/find", idToNum],
    queryFn: async () => {
      const response = await axiosAuthorized.post("users/find", {
        id: idToNum,
      });
      return response.data;
    },
  });

  if (!isUserDataLoading) {
    const userId = userData?.id;
    if (userId) {
      getAvatarById(userId)
        .then((avatarData) => {
          setAvatarImage(avatarData)
        })
        .catch((error) => {
          console.error("Błąd podczas pobierania danych o avatarze:", error);
        });
    }
  }

  console.log('avatar image xddd -------------------------')
  console.log(avatarImage)
  //userData: id, username, messages
  //conversationData: createdAt, creator, recipient, lastMessageSent,
  //lastMessageSentAt, id, messages
  const { data: conversationData, isLoading: isConversationDataLoading } =
    useQuery({
      queryKey: ["conversations/findConversation", idToNum],
      queryFn: async () => {
        const response = await axiosAuthorized.post(
          "conversations/conversation",
          { recipientId: idToNum }
        );
        return response.data;
      },
    });
  console.log(conversationData);
  console.log("user data");
  console.log(userData);

  // const user: UserType = data;
  // const user = users.find((user) => user.id === parseInt(id));
  // if (!user) {
  //   return (
  //     <Typography
  //       fontFamily={"Readex Pro"}
  //       fontSize={"23px"}
  //       color={"#fff"}
  //       variant="h5"
  //     >
  //       Error 404 something went wrong, can't find such user
  //     </Typography>
  //   );
  // }
  return (
    <Box
      sx={{
        padding: "0px 20px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <ConversationNavbar
        user={userData}
        isUserDataLoading={isUserDataLoading}
        userImage={avatarImage}
      />
      <Typography
        fontFamily={"Readex Pro"}
        fontSize={"23px"}
        sx={{ color: "#fff" }}
      ></Typography>
      <Box
        sx={{
          height: "100vh",
          overflow: "scroll",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <ConversationChat
          user={userData}
          conversation={conversationData}
          isUserDataLoading={isUserDataLoading}
          isConversationDataLoading={isConversationDataLoading}
          userImage={avatarImage}

        />
      </Box>
      <ConversationInputPanel
        user={userData}
        isUserDataLoading={isUserDataLoading}
        conversation={conversationData}
        isConversationDataLoading={isConversationDataLoading}

      />
    </Box>
  );
};
