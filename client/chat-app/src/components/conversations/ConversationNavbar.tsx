import { Box, Typography } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

type ConversationNavbarProps = {
  user: Partial<UserType>;
  isUserDataLoading: boolean;
};
export type UserType = {
  id: number;
  username: string;
};
export const ConversationNavbar = ({
  user,
  isUserDataLoading,
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
        <AccountCircleRoundedIcon
          sx={{
            height: "64px",
            width: "64px",
            color: "white",
          }}/>
      <Typography
        sx={{ paddingLeft: "25px" }}
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
