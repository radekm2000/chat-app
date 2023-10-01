import { Input } from "@mui/material";
import { UserProps } from "./ConversationNavbar";
export type ConversationInputPanelProps = {
    user: Partial<UserProps>
}
export const ConversationInputPanel = ({user}: ConversationInputPanelProps) => {
    const {username} = user;
  return (
    <Input inputProps={{spellCheck: false}} placeholder={`Message ${username}`} disableUnderline multiline fullWidth maxRows={10} sx={{borderRadius: '5px', backgroundColor: '#151515', width: '100%', minHeight: '70px', paddingLeft: '10px', fontFamily: 'Arial', fontSize: '18px', color: '#fff', marginTop:'auto'}}/>
  );
};
