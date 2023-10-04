import { Box, Typography } from "@mui/material";
import { FindUserParams, SearchBarResponse, User } from "../../../types/types";
import { useLocation } from "wouter";
import { useAuth } from "../../../hooks/useAuth";
import { useAxiosAuthorized } from "../../../hooks/useAxiosAuthorized";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../hooks/useUser";

export const SidebarSearchbarResponseWindow = ({ data, isLoading }) => {
  const [location, setLocation] = useLocation();
  const { auth } = useAuth();
  const axiosAuthorized = useAxiosAuthorized();
  const { meUser } = useUser();
  const createConversation = async (username: string) => {
    try {
      const response = await axiosAuthorized.post("conversations", {
        username,
        message: "First message",
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

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
    setLocation(`/conversations/${userId}`);
    createConversation(username);
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
