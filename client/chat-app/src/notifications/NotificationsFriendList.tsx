import { Avatar, Box, Typography } from "@mui/material";
import { useFriendsQuery } from "../hooks/useFriendsQuery";
import { useEffect, useState } from "react";
import {
  Friendship,
  OnlineUser,
  UserAvatars,
  friendRecord,
} from "../types/types";
import { deleteFriendRecord, getAvatarById } from "../api/axios";
import { useUser } from "../hooks/useUser";
import { getFriendFromFriendship } from "../utils/getFriendFromFriendship";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useLocation } from "wouter";
import { useSocket } from "../hooks/useSocket";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
export const NotificationsFriendList = () => {
  const { data: friendsData, isLoading } = useFriendsQuery();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [avatars, setAvatars] = useState<Array<UserAvatars>>([]);
  const { meUser } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && friendsData && friendsData.length !== 0) {
      Promise.all(
        friendsData.map(async (friendData) => {
          try {
            const friend = getFriendFromFriendship(friendData, meUser);
            if (friend) {
              const avatar = await getAvatarById(friend.id);
              return {
                avatar: avatar as string,
                userId: friend.id,
              };
            }
          } catch (error) {
            return null;
          }
        })
      ).then((avatars) => {
        const filteredAvatars = avatars.filter((avatar) => avatar !== null);
        setAvatars(filteredAvatars);
      });
    }
  }, [friendsData]);

  const deleteFriendRecordMutation = useMutation({
    mutationFn: deleteFriendRecord,
    mutationKey: ["friends/delete"],
    onSuccess: (data: { friendRecord: friendRecord }) => {
      queryClient.setQueryData(["friends"], (friendsData?: Friendship[]) => {
        return friendsData?.filter((friendData) => {
          return friendData.id !== data.friendRecord.id;
        });
      });
      queryClient.invalidateQueries(["friends"]);
      toast.success("Friend has been deleted!");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    },
  });

  const handleDeleteFriendRecordClick = (friendRecordId: number) => {
    const { mutate } = deleteFriendRecordMutation;
    mutate(friendRecordId);
  };

  useEffect(() => {
    socket.on("getOnlineUsers", (onlineUsers: OnlineUser[]) => {
      setOnlineUsers(onlineUsers);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [onlineUsers, socket]);

  if (isLoading) {
    return "isLoading...";
  }

  const handleFriendIconClick = (friendId: number) => {
    setLocation(`/conversations/${friendId}`);
  };
  return (
    <Box
      sx={{
        marginLeft: "10px",
        maxHeight: "75vh",
        height: "auto",
        overflow: "scroll",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {friendsData?.map((friendData, index) => {
        const friend = getFriendFromFriendship(friendData, meUser);
        if (friend) {
          const isFriendOnline = onlineUsers.some(
            (onlineUser) => onlineUser.userId === friend.id
          );
          const matchingFriendAvatar = avatars.find(
            (avatar) => avatar.userId === friend.id
          );
          return (
            <Box
              key={friend.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 5px",
                maxHeight: "100vh",
              }}
            >
              <Box
                key={friend.id}
                sx={{ cursor: "pointer" }}
                onClick={() => handleFriendIconClick(friend.id)}
              >
                {matchingFriendAvatar ? (
                  <Avatar
                    src={matchingFriendAvatar.avatar}
                    sx={{
                      width: "48px",
                      height: "48px",
                      position: "relative",
                    }}
                  />
                ) : (
                  <AccountCircleRoundedIcon />
                )}
                {isFriendOnline && (
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#0DE638",
                      borderRadius: "50%",
                      position: "relative",
                      bottom: "14px",
                      right: "-5px",
                    }}
                  ></Box>
                )}
              </Box>
              <Box
                sx={{
                  marginLeft: "10px",
                  display: "flex",
                  alignItems: "center",
                  marginRight: "auto",
                }}
                key={index}
              >
                <Typography
                  sx={{
                    fontFamily: "Readex Pro",
                    fontSize: "23px",
                    color: "white",
                  }}
                >
                  {friend.username}
                </Typography>
              </Box>
              <DeleteIcon
                sx={{ color: "grey", cursor: "pointer" }}
                onClick={() => handleDeleteFriendRecordClick(friendData.id)}
              />
            </Box>
          );
        }
      })}
    </Box>
  );
};
