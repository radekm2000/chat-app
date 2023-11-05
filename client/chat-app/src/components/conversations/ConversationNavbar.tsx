import { Avatar, Box, IconButton, Typography } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

type ConversationNavbarProps = {
  user: Partial<UserType>;
  isUserDataLoading: boolean;
  userImage: string
};
export type UserType = {
  id: number;
  username: string;
};
export const ConversationNavbar = ({
  user,
  isUserDataLoading,
  userImage
}: ConversationNavbarProps) => {

  return !isUserDataLoading ? (
    <Box
      sx={{
        height: "98px",
        borderBottom: "1px solid rgb(40, 40,40)",
        display: "flex",
        alignItems: "center",
      }}
    >
      {userImage ? (
        <IconButton>
          <Avatar src={userImage} alt="user Avatar" style={{height: '64px', width: '64px'}}/>
        </IconButton>
      ) : (
        
        <AccountCircleRoundedIcon
          sx={{
            height: "64px",
            width: "64px",
            color: "white",
          }}/>
      )}

      <Typography
        sx={{ paddingLeft: "15px" }}
        fontFamily={"Readex Pro"}
        fontSize={"23px"}
        color={"#fff"}
        variant="h5" 
      >
        {user?.username}
      </Typography>
    </Box>
  ) : null;
};
