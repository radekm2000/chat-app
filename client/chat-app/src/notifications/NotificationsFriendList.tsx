import { Avatar, Box, Typography } from "@mui/material";
import { useFriendsQuery } from "../hooks/useFriendsQuery";
import { useEffect, useState } from "react";
import { UserAvatars } from "../types/types";
import { getAvatarById } from "../api/axios";
import { useUser } from "../hooks/useUser";
import { getFriendFromFriendship } from "../utils/getFriendFromFriendship";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

export const NotificationsFriendList = () => {
  const { data: friendsData, isLoading } = useFriendsQuery();
  const [avatars, setAvatars] = useState<Array<UserAvatars>>([]);
  const { meUser } = useUser();
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

  console.log(friendsData);
  console.log("avatary friendsow");
  console.log(avatars);
  return (
    <Box
      sx={{
        marginLeft: "10px",
        height: "80vh",
        overflow: "scroll",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {friendsData?.map((friendData, index) => {
        const friend = getFriendFromFriendship(friendData, meUser);
        if (friend) {
          const matchingFriendAvatar = avatars.find(
            (avatar) => avatar.userId === friend.id
          );
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "5px 5px",
                maxHeight: '100vh'
              }}
            >
              <Box>
                {matchingFriendAvatar ? (
                  <Avatar
                    src={matchingFriendAvatar.avatar}
                    sx={{ width: "48px", height: "48px" }}
                  />
                ) : (
                  <AccountCircleRoundedIcon />
                )}
              </Box>
              <Box sx={{ marginLeft: "10px" }} key={index}>
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
            </Box>
          );
        }
      })}
    </Box>
  );
};
