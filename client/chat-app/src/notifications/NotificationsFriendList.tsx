import { Box, Typography } from "@mui/material";
import { useFriendsQuery } from "../hooks/useFriendsQuery";
import { useEffect, useState } from "react";
import { UserAvatars } from "../types/types";
import { getAvatarById } from "../api/axios";
import { useUser } from "../hooks/useUser";
import { getFriendFromFriendship } from "../utils/getFriendFromFriendship";

export const NotificationsFriendList = () => {
  const { data: friendsData, isLoading } = useFriendsQuery();
  const [avatars, setAvatars] = useState<Array<UserAvatars>>([]);
  const { meUser } = useUser();
  useEffect(() => {
    if (!isLoading) {
      if (friendsData && friendsData.length !== 0) {
        Promise.all(
          friendsData.map((friendData) => {
            const friend = getFriendFromFriendship(friendData, meUser);
            if (friend) {
              getAvatarById(friend.id).then((avatar) => ({
                avatar: avatar as string,
                userId: friend.id,
              }));
            }
          })
        ).then((avatars) => {
          console.log(avatars);
          setAvatars(avatars);
        });
      }
    }
  }, [friendsData]);

  console.log(friendsData);
  console.log("avatary friendsow");
  console.log(avatars);
  return (
    <Box
      sx={{
        width: "200px",
        height: "200px",
        backgroundColor: "red",
        marginLeft: "10px",
      }}
    >
      {friendsData?.map((friendData, index) => {
        const friend = getFriendFromFriendship(friendData, meUser);
        if (friend) {
          return (
            <Box key={index}>
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
          );
        }
      })}
    </Box>
  );
};
