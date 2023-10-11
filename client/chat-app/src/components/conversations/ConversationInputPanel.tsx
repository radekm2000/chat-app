import { Input } from "@mui/material";
import { UserType } from "./ConversationNavbar";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosAuthorized } from "../../hooks/useAxiosAuthorized";
import { useSocket } from "../../hooks/useSocket";

export type ConversationProps = {
  createdAt: Date;
  id: number;
  messages: [];
  lastMessageSentAt: Date | null;
  lastMessageSent: string | null;
};
export type ConversationInputPanelProps = {
  user: Partial<UserType>;
  isUserDataLoading: boolean;
  isConversationDataLoading: boolean;
  conversation: ConversationProps;
};
export const ConversationInputPanel = ({
  user,
  isConversationDataLoading,
  isUserDataLoading,
  conversation,
}: ConversationInputPanelProps) => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const axiosAuthorized = useAxiosAuthorized();

  console.log("conversation id: ");
  console.log(conversation?.id);
  useEffect(() => {
    socket.on("getMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("getMessage");
    };
  });
  const mutation = useMutation({
    mutationFn: async () => {
      console.log("wyslane conversation id: ", conversation.id);
      const response = await axiosAuthorized.post("messages", {
        content: message,
        conversationId: conversation.id,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([
        "conversations",
        data?.updatedConversation?.lastMessageSentAt?.content,
      ]);

      queryClient.invalidateQueries([
        "conversation/messages",
        conversation?.id,
      ]);
      setMessage(data.message);
      setMessage("");
      console.log("wiadomosc wyslana");
      console.log("odebrane dane:");
      setMessages((prev) => [...prev, data.message]);
      console.log(data);
      socket.emit("sendMessage", {
        content: data?.message?.content,
        recipientId: data?.message?.recipient?.id,
      });
    },
    onError: () => {
      console.log("error");
    },
  });
  // const { username } = user;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  console.log('wiadomosci z websocket')
  console.log(messages)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (message.trim() !== "") {
        const { mutate, error, isError } = mutation;
        mutate();
        if (isError) {
          console.log(error);
        }
      }
    }
  };
  return (
    <Input
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => handleKeyDown(e)}
      inputProps={{ spellCheck: false }}
      placeholder={`Message ${user?.username}`}
      disableUnderline
      value={message}
      multiline
      fullWidth
      maxRows={10}
      sx={{
        borderRadius: "5px",
        backgroundColor: "#151515",
        width: "100%",
        minHeight: "70px",
        paddingLeft: "10px",
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#fff",
        marginTop: "auto",
      }}
    />
  );
};
