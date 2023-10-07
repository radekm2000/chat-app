import { Box, Typography } from "@mui/material";
import users from "../../users.json";
import { ConversationNavbar } from "./ConversationNavbar";
import { ConversationInputPanel } from "./ConversationInputPanel";
import { ConversationChat } from "./ConversationChat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { findUserById } from "../../api/axios";
import { useAxiosAuthorized } from "../../hooks/useAxiosAuthorized";

export type UserType = {
  id: number;
  username: string;
  messages: [];
};
export const ConversationChannelPage = ({ id }: { id: string }) => {
  const idToNum = parseInt(id);
  const axiosAuthorized = useAxiosAuthorized();
  console.log(idToNum);
  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["users/find", idToNum],
    queryFn: async () => {
      const response = await axiosAuthorized.post("users/find", {
        id: idToNum,
      });
      return response.data;
    },
  });

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

  // const user: UserType = data;
  const user = users.find((user) => user.id === parseInt(id));
  if (!user) {
    return (
      <Typography
        fontFamily={"Readex Pro"}
        fontSize={"23px"}
        color={"#fff"}
        variant="h5"
      >
        Error 404 something went wrong, can't find such user
      </Typography>
    );
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
      <ConversationNavbar user={user} isUserDataLoading={isUserDataLoading} />
      <Typography
        fontFamily={"Readex Pro"}
        fontSize={"23px"}
        sx={{ color: "#fff" }}
      ></Typography>
      <ConversationChat user={user} isUserDataLoading={isUserDataLoading}
      conversation={conversationData} isConversationDataLoading={isConversationDataLoading} />
      <ConversationInputPanel
        user={user}
        isUserDataLoading={isUserDataLoading} conversation={conversationData} isConversationDataLoading={isConversationDataLoading}
      />
    </Box>
  );
};
