import { Box } from "@mui/material"
import { ConversationSidebar } from "../conversations/ConversationSidebar"
import { ConversationChannelPage } from "../conversations/Conversation"

export const ConversationPage = () => {
  return (
    <Box sx={{display: 'flex',
    backgroundColor: '#1F1F1F', width: '100%', height:'100vh', margin: '-8px'}}>
      <Box sx={{width: '400px', borderRight: '1px solid white', height: '100vh',overflow: 'scroll',
    '&::-webkit-scrollbar': {display: 'none'}}}>
        <ConversationSidebar/>
      </Box>
      <Box sx={{flexGrow: 1}}>
        <ConversationChannelPage/>
      </Box>
    </Box>
  )
}
