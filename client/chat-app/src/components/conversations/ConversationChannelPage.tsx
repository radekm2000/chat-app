import { Box, Typography } from "@mui/material";
import users from "../../users.json";
import { ConversationNavbar } from "./ConversationNavbar";
import { ConversationInputPanel } from "./ConversationInputPanel";
import { ConversationChat } from "./CovnersationChat";
export const ConversationChannelPage = ({ id }: { id: string }) => {
  const user = users.find((user) => user.id === parseInt(id));
  if (!user) {
    return (
      <Typography
        fontFamily={"Readex Pro"}
        fontSize={"23px"}
        color={"#fff"}
        variant="h5"
      >
        Error 404 something went wrong, can't find such user
      </Typography>
    );
  }
  return (
    <Box sx={{padding: '0px 20px', display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <ConversationNavbar user={user} />
      <Typography
        fontFamily={"Readex Pro"}
        fontSize={"23px"}
        sx={{ color: "#fff" }}
      >
        user: {user.username}
      </Typography>
      <ConversationChat user={user}/>
      <ConversationInputPanel user={user}/>
    </Box>
  );
};
