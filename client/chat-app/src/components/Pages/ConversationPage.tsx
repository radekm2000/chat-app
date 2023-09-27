import { Box } from "@mui/material";
import { ConversationSidebar } from "../conversations/ConversationSidebar";
import { ConversationPanel } from "../conversations/ConversationPanel";
import { useRoute } from "wouter";
import { ConversationChannelPage } from "../conversations/ConversationChannelPage";
const SIDEBAR_WIDTH = "400px";
export const ConversationPage = () => {
  const [match, params] = useRoute("/conversations/:id");
  const id = params ? params.id : null;
  console.log(id)
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#151515",
        width: "100%",
        height: "100vh",
        margin: "-8px",
      }}
    >
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          borderRight: "1px solid #808080",
          height: "100vh",
          overflow: "scroll",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <ConversationSidebar />
      </Box>
      <Box sx={{ flexGrow: 1, backgroundColor: '#1E1E1E'}}>
        {id ? <ConversationChannelPage id={id}/> : <ConversationPanel/>}
      </Box>
    </Box>
  );
};
