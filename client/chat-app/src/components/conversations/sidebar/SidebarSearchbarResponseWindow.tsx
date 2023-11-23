import { Avatar, Box, Typography } from "@mui/material";
import { useLocation } from "wouter";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import { useAxiosAuthorized } from "../../../hooks/useAxiosAuthorized";
import { useUser } from "../../../hooks/useUser";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { createConversationApi } from "../../../api/axios";
import toast from "react-hot-toast";
import { useSocket } from "../../../hooks/useSocket";
import { useEffect, useState } from "react";
import { addAvatarsToRecipients } from "../../../utils/addAvatarToRecipients";
import Image from "mui-image";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import { useAddUserToFriends } from "../../../hooks/useAddUserToFriends";
import { AxiosError } from "axios";

export const SidebarSearchbarResponseWindow = ({
  data,
  isLoading,
}: {
  isLoading: boolean;
  data: any;
}) => {
  type UserSearchbarResponseWindow = {
    username: string;
    id: number;
    avatar: string | null;
  };

  type FriendRequest = {
    username: string;
    userId: undefined | number;
  };
  const [, setLocation] = useLocation();
  const axiosAuthorized = useAxiosAuthorized();
  const { meUser } = useUser();
  const queryClient = useQueryClient();
  const socket = useSocket();
  const [friendRequest, setFriendRequest] = useState<FriendRequest>({
    username: "",
    userId: undefined,
  });
  const [users, setUsers] = useState<UserSearchbarResponseWindow[]>([]);
  const mutation = useMutation({
    mutationFn: createConversationApi,
    mutationKey: ["conversations/create"],
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
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

  const sendFriendRequestMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosAuthorized.post("friend-requests", {
        username: friendRequest.username,
        userId: friendRequest.userId,
      });
      return response.data;
    },
    mutationKey: ["users/addToFriend"],
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      }
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
    },
  });
  const findRecipient = async (userId: string) => {
    const userIdToNum = parseInt(userId);
    const response = await axiosAuthorized.post("users/find", {
      id: userIdToNum,
    });
    const recipient = response.data;
    return recipient;
  };

  const handleAddUserToFriends = async (username: string, userId: number) => {
    setFriendRequest({ username, userId });
    const { mutate } = sendFriendRequestMutation;
    if (username === meUser) {
      toast.error(`Can't add yourself to friends`);
      return;
    }
    mutate({ username, userId });
    console.log(userId, username);
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

  console.log("dane z searchbara ------s ");
  console.log(data);

  useEffect(() => {
    if (data.length === 0) {
      setUsers([]);
    }

    addAvatarsToRecipients(data)
      .then((usersWithAvatars) => {
        const updatedUsers = data.map((user) => {
          const matchingAvatarUser = usersWithAvatars.find(
            (u) => u?.id === user?.id
          );

          if (matchingAvatarUser) {
            return { ...user, avatar: matchingAvatarUser.avatar };
          }
          return user;
        });
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [data]);
  console.log("users with avatars");
  console.log(users);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e1e",
      }}
    >
      {isLoading && <Typography>Loading...</Typography>}
      {users &&
        users.map((user) => (
          <Box
            key={user?.id}
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
              }}
            >
              {user?.avatar ? (
                <Image
                  src={user?.avatar || ""}
                  alt="userSearchBarAvatar"
                  width={32}
                  height={32}
                  style={{ borderRadius: "50%" }}
                  duration={0}
                />
              ) : (
                <AccountCircleRoundedIcon
                  sx={{ width: "32px", height: "32px", color: "white" }}
                />
              )}
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between" }}
              key={user?.id}
            >
              <Typography
                onClick={() => handleUserWindowClick(user?.id)}
                sx={{ cursor: "pointer" }}
                fontFamily={"Readex Pro"}
                fontSize={"16px"}
                color={"white"}
              >
                {user?.username == meUser ? "Me" : user?.username}
              </Typography>
            </Box>
            <Box
              onClick={() => handleAddUserToFriends(user?.username, user?.id)}
              sx={{
                marginLeft: "auto",
                height: "32px",
                width: "32px",
                cursor: "pointer",
              }}
            >
              <PersonAddRoundedIcon
                sx={{
                  color: "white",
                  marginLeft: "auto",
                }}
              />
            </Box>
          </Box>
        ))}
    </Box>
  );
};
