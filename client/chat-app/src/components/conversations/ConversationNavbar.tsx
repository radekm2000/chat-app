import { Box, Typography } from "@mui/material";
type ConversationNavbarProps = {
    user: Partial<UserProps>
}
export type UserProps = {
  username?: string;
  lastMessage?: string;
  id?: number;
  messages?: string[]
};
export const ConversationNavbar = ({user}: ConversationNavbarProps) => {
  return <Box sx={{ height: "98px", borderBottom: '1px solid rgb(40, 40,40)', display: 'flex', alignItems: 'center',}}>
    <Box borderRadius={'50%'} sx={{width: '64px', height: '64px', backgroundColor: 'white'}}></Box>
    <Typography sx={{paddingLeft: '25px'}} fontFamily={'Readex Pro'} fontSize={'23px'} color={'#fff'} variant="h5">{user.username}</Typography>
  </Box>;
};
