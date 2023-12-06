import PeopleIcon from "@mui/icons-material/People";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import { useFriendRequestsQuery } from "../hooks/useFriendRequestsQuery";
import { FriendRequest, Friendship, UserAvatars } from "../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  getAvatarById,
  rejectFriendRequest,
} from "../api/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const NotificationsSidebar = () => {
  const { data: friendRequests, isLoading } = useFriendRequestsQuery();
  const [isFriendsListOpen, setIsFriendsListOpen] = useState(false);
  const queryClient = useQueryClient();
  const [avatars, setAvatars] = useState<Array<UserAvatars>>([]);

  const handleFriendListIconClick = () => {
    setIsFriendsListOpen(!isFriendsListOpen);
  };
  useEffect(() => {
    if (!isLoading && friendRequests && friendRequests.length !== 0) {
      Promise.all(
        friendRequests.map(async (friendRequest) => {
          try {
            const avatar = await getAvatarById(friendRequest?.sender?.id);
            return {
              avatar: avatar as string,
              userId: friendRequest.sender.id,
            };
          } catch (error) {
            return null;
          }
        })
      )
        .then((avatars) => {
          const filteredAvatars = avatars.filter((avatar) => avatar !== null);
          setAvatars(filteredAvatars);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [friendRequests, isLoading]);

  const acceptFriendRequestMutation = useMutation({
    mutationFn: acceptFriendRequest,
    mutationKey: ["acceptFriendRequest"],
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    },
    onSuccess: (data: { friend: Friendship }) => {
      toast.success(
        `You are now  friends with ${data.friend.sender.username}`,
        { position: "top-right" }
      );
      queryClient.setQueryData(
        ["friendRequests"],
        (friendRequests?: FriendRequest[]) => {
          return friendRequests?.filter(
            (friendRequest) =>
              friendRequest.sender.username !== data.friend.sender.username
          );
        }
      );
      queryClient.invalidateQueries(["friends"]);
    },
  });

  const rejectFriendRequestMutation = useMutation({
    mutationFn: rejectFriendRequest,
    mutationKey: ["rejectFriendRequest"],
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    },
    onSuccess: (data: {
      message: string;
      updatedFriendRequest: FriendRequest;
    }) => {
      console.log(data);
      toast.error(data.message, { position: "top-right" });
      queryClient.setQueryData(
        ["friendRequests"],
        (friendRequests?: FriendRequest[]) => {
          return friendRequests?.filter(
            (friendRequest) =>
              friendRequest.sender.username !==
              data.updatedFriendRequest.sender.username
          );
        }
      );
    },
  });

  if (isLoading) {
    return "isLoading...";
  }
  const handleAcceptFriendRequestClick = (friendRequest: FriendRequest) => {
    const { mutate } = acceptFriendRequestMutation;
    mutate(friendRequest.id);
  };

  const handleRejectFriendRequestClick = (friendRequest: FriendRequest) => {
    const { mutate } = rejectFriendRequestMutation;
    mutate(friendRequest.id);
  };
  return (
    <Box>
      <Box sx={{ paddingLeft: "260px", display: "flex", position: "relative" }}>
        <PeopleIcon
          onClick={() => handleFriendListIconClick()}
          sx={{
            color: "white",
            width: "40px",
            height: "40px",
            marginRight: "auto",
            cursor: "pointer",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "#ada397",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            right: "25px",
            top: "20px",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              position: "absolute",
              fontWeight: "800",
              fontFamily: "arial",
              right: "7px",
            }}
          >
            {friendRequests?.length}
          </Typography>
        </Box>
        {isFriendsListOpen ? (
          <Box
            sx={{
              position: "absolute",
              backgroundColor: "#3e4444",
              height: "307px",
              width: "250px",
              top: "8px",
              right: "45px",
              borderRadius: "2%",
              zIndex: 1,
            }}
          >
            {friendRequests?.map((friendRequest, index) => {
              const currentUserAvatar = avatars.find(
                (avatar) => avatar?.userId === friendRequest?.sender?.id
              );

              return (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgb(50,50,50)",
                    padding: "5px 5px",
                  }}
                  key={index}
                >
                  <Box>
                    {currentUserAvatar ? (
                      <Avatar src={currentUserAvatar.avatar} />
                    ) : (
                      <AccountCircleRoundedIcon sx={{ color: "white" }} />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontFamily: "Readex Pro",
                      color: "white",
                    }}
                  >
                    {`${friendRequest.sender.username}`}
                  </Typography>
                  <Box>
                    <IconButton
                      onClick={() =>
                        handleAcceptFriendRequestClick(friendRequest)
                      }
                      color="success"
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleRejectFriendRequestClick(friendRequest)
                      }
                      color="error"
                    >
                      <ClearIcon />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
