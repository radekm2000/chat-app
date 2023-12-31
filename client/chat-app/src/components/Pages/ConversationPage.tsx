import { Box } from "@mui/material";
import { ConversationSidebar } from "../conversations/ConversationSidebar";
import { ConversationPanel } from "../conversations/ConversationPanel";
import { useRoute } from "wouter";
import { NotificationsPanel } from "../../notifications/NotificationsPanel";
import { useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";
import { ConversationChannelPage } from "../conversations/ConversationChannelPage";
import { useMediaQuery } from "../../hooks/useMediaQuery";
const SIDEBAR_WIDTH = "400px";
export const ConversationPage = () => {
  const accessToken = localStorage.getItem("token");
  const socket = useSocket();
  const below1200 = useMediaQuery(1200);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("token");
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  });

  socket.on("connect_error", (err) => {
    if (err?.message === "jwt malformed") {
      setTimeout(() => {
        const accessToken = localStorage.getItem("token");
        socket.io.opts.extraHeaders = {
          Authorization: `Bearer ${accessToken}`,
        };

        socket.connect();
      }, 1000);
    }
  });

  useEffect(() => {
    if (socket.connected === false) {
      socket.connect();
    }
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [accessToken, socket]);

  const [, params] = useRoute("/conversations/:id");
  const id = params ? params.id : null;
  return (
    <>
      {below1200 ? (
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
              borderRight: "1px solid rgb(40, 40,40)",
              height: "100vh",
              overflow: "scroll",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <ConversationSidebar userChatId={id} />
          </Box>
          <Box sx={{ flexGrow: 1, backgroundColor: "#1E1E1E" }}>
            {id ? (
              <ConversationChannelPage userChatId={id} />
            ) : (
              <ConversationPanel />
            )}
          </Box>
        </Box>
      ) : (
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
              borderRight: "1px solid rgb(40, 40,40)",
              height: "100vh",
              overflow: "scroll",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <ConversationSidebar userChatId={id} />
          </Box>
          <Box sx={{ flexGrow: 1, backgroundColor: "#1E1E1E" }}>
            {id ? (
              <ConversationChannelPage userChatId={id} />
            ) : (
              <ConversationPanel />
            )}
          </Box>
          <Box
            sx={{
              borderLeft: "1px solid rgb(40, 40,40)",
              width: "300px",
              backgroundColor: "#1E1E1E",
            }}
          >
            <NotificationsPanel />
          </Box>
        </Box>
      )}
    </>
  );
};
