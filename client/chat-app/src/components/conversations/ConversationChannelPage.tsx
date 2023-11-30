import { Box, Typography } from "@mui/material";
import { ConversationNavbar } from "./ConversationNavbar";
import { ConversationInputPanel } from "./ConversationInputPanel";
import { ConversationChat } from "./ConversationChat";
import { useState } from "react";
import { getAvatarById } from "../../api/axios";
import { useRecipientUser } from "../../hooks/useRecipientUser";
import { useUserConversationQuery } from "../../hooks/useUserConversationQuery";

export const ConversationChannelPage = ({
  userChatId,
}: {
  userChatId: string;
}) => {
  const idToNum = parseInt(userChatId);
  const [avatarImage, setAvatarImage] = useState("");

  const { data: userData, isLoading: isUserDataLoading } =
    useRecipientUser(userChatId);

  if (!isUserDataLoading) {
    const userId = userData?.id;
    if (userId) {
      getAvatarById(userId)
        .then((avatarData) => {
          setAvatarImage(avatarData);
        })
        .catch((error) => {
          console.error("There was an error with loading avatar data", error);
        });
    }
  }

  const { data: conversationData, isLoading: isConversationDataLoading } =
    useUserConversationQuery(idToNum);

  if (!conversationData) {
    return;
  }

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
