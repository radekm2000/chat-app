import PeopleIcon from "@mui/icons-material/People";
import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useFriendRequestsQuery } from "../hooks/useFriendRequestsQuery";
import { addAvatarsToRecipients } from "../utils/addAvatarToRecipients";
import { FriendRequest, Friendship } from "../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, rejectFriendRequest } from "../api/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const NotificationsSidebar = () => {
  const { data: friendRequests, isLoading } = useFriendRequestsQuery();
  const [isFriendsListOpen, setIsFriendsListOpen] = useState(false);
  console.log(friendRequests);
  const queryClient = useQueryClient();

  const handleFriendListIconClick = () => {
    setIsFriendsListOpen(!isFriendsListOpen);
  };

  //to do - assign avatars to friend requests senders
  //   useEffect(() => {
  //     if (friendRequests && friendRequests.length === 0) return;
  //     friendRequests?.forEach(async (friendRequest) => {
  //       const senders = [friendRequest.sender];
  //       addAvatarsToRecipients(senders).then((sendersWithAvatars) => {
  //         const updatedSenders = senders.map((sender) => {
  //           const matchingAvatarSender = sendersWithAvatars.find(
  //             (s) => s.id === sender.id
  //           );
  //           if (matchingAvatarSender) {
  //             return { ...sender, avatar: matchingAvatarSender.avatar };
  //           }
  //           return sender;
  //         });
  //       });
  //     });
  //   }, [friendRequests]);

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
              height: "300px",
              width: "250px",
              top: "8px",
              right: "45px",
              borderRadius: "2%",
            }}
          >
            {friendRequests?.map((friendRequest, index) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid rgb(50,50,50)",
                  paddingLeft: "5px",
                }}
                key={index}
              >
                <Typography
                  key={index}
                  sx={{
                    fontSize: "23px",
                    fontFamily: "Readex Pro",
                    color: "white",
                  }}
                >{`${friendRequest.sender.username}`}</Typography>
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
            ))}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
