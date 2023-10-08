import { Box, Typography } from "@mui/material";
import { useLocation } from "wouter";
import { useAuth } from "../../../hooks/useAuth";
import { useAxiosAuthorized } from "../../../hooks/useAxiosAuthorized";
import { useUser } from "../../../hooks/useUser";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { createConversationApi } from "../../../api/axios";
import toast from "react-hot-toast";

export const SidebarSearchbarResponseWindow = ({ data, isLoading }: {isLoading: boolean}) => {
  const [, setLocation] = useLocation();
  const axiosAuthorized = useAxiosAuthorized();
  const { meUser } = useUser();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createConversationApi,
    mutationKey: ["conversations/create"],
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations'])
      toast.success("Conversation created", { position: "top-right" });
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        if (error?.response?.data?.message === "Conversation already exists") {
          toast.error("Conversation already exists", { position: "top-right" });
        } else if (
          error?.response?.data?.message ==
          "Cannot create conversation with  yourself"
        ) {
          toast.error(`Can't create conversation with yourself`, {
            position: "top-right",
          });
        }
      }
    },
  });
  // const createConversation = async (username: string) => {
  //   try {
  //     const response = await axiosAuthorized.post("conversations", {
  //       username,
  //       message: "First message",
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const findRecipient = async (userId: string) => {
    const userIdToNum = parseInt(userId);
    const response = await axiosAuthorized.post("users/find", {
      id: userIdToNum,
    });
    const recipient = response.data;
    return recipient;
  };

  const handleUserWindowClick = async (userId: string) => {
    const recipient = await findRecipient(userId);
    if (!recipient) {
      throw new Error(
        `Can't create a conversation with non existing recipient`
      );
    }
    const username = recipient.username;
    // setLocation(`/conversations/${userId}`);
    const { mutate } = mutation;
    // createConversation(username);
    mutate({ username });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e1e",
      }}
    >
      {isLoading && <Typography>Loading...</Typography>}
      {data &&
        data.map((user) => (
          <Box
            onClick={() => handleUserWindowClick(user.id)}
            key={user.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderBottom: "1px solid rgb(40, 40,40)",
              ":hover": {
                backgroundColor: "rgb(40, 40,40)",
                opacity: "0.8",
                borderRadius: "2%",
              },
              width: "250px",
              maxHeight: "200px",
              marginTop: "10px",
              marginBottom: "2px",
              marginLeft: "25px",
            }}
          >
            <Box
              sx={{
                width: "32px",
                height: "32px",
                backgroundColor: "blue",
                borderRadius: "50%",
              }}
            ></Box>
            <Box key={user.id}>
              <Typography
                fontFamily={"Readex Pro"}
                fontSize={"16px"}
                color={"white"}
              >
                {user.username == meUser ? "Ja" : user.username}
              </Typography>
            </Box>
          </Box>
        ))}
    </Box>
  );
};
