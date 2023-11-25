import { Box, Typography } from "@mui/material";
import { useFriendsQuery } from "../hooks/useFriendsQuery";

export const NotificationsFriendList = () => {
  const { data: friendsData } = useFriendsQuery();

  console.log(friendsData);
  return (
    <Box sx={{ width: "200px", height: "200px", backgroundColor: "red" }}>
      {friendsData?.map((friendData, index) => (
        <Box key={index}>
          <Typography sx={{ color: "white" }}>
            {friendData.sender.username}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
