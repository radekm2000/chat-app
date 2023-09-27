import { Box, Typography } from "@mui/material";
type ConversationNavbarProps = {
    user: Partial<UserProps>
}
type UserProps = {
  username?: string;
  lastMessage?: string;
  id?: number;
};
export const ConversationNavbar = ({user}: ConversationNavbarProps) => {
  const { username, lastMessage } = user;
  return <Box sx={{ height: "98px", borderBottom: '1px solid #808080', display: 'flex', alignItems: 'center',}}>
    <Box borderRadius={'50%'} sx={{width: '64px', height: '64px', backgroundColor: 'white'}}></Box>
    <Typography sx={{paddingLeft: '25px'}} fontFamily={'Readex Pro'} fontSize={'23px'} color={'#fff'} variant="h5">{user.username}</Typography>
  </Box>;
};
