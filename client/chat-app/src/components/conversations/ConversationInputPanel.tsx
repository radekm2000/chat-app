/* eslint-disable @typescript-eslint/no-unused-vars */
import { Input } from "@mui/material";
import { UserType } from "./ConversationNavbar";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosAuthorized } from "../../hooks/useAxiosAuthorized";
import { useSocket } from "../../hooks/useSocket";
import { useUser } from "../../hooks/useUser";
import { getRecipientFromConversation } from "../../utils/getRecipientFromConversation";
import { useChatMsg } from "../../hooks/useChatMsg";
import { Conversation } from "../../types/types";
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
  conversation: Conversation;
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
  const [typing, setTyping] = useState(false);
  const { meUser } = useUser();
  const { setChatMessages } = useChatMsg();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeout: any = undefined;
  useEffect(() => {}, [timeout]);

  const timeoutFunction = () => {
    setTyping(false);
    socket.emit("noLongerTypingMessage");
  };

  const mutation = useMutation({
    mutationFn: async () => {
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
      setChatMessages((prev) => [...prev, data.message]);
      socket.emit("sendMessage", {
        msg: data?.message,
        recipientId: getRecipientFromConversation(
          data?.updatedConversation,
          meUser
        ).id,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const [message, setMessage] = useState("");
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setTyping(false);
      if (message.trim() !== "") {
        const { mutate, error, isError } = mutation;
        mutate();
        if (isError) {
          console.log(error);
        }
      }
    } else {
      if (e.key !== "Backspace" && typing === false) {
        setTyping(true);
        socket.emit("typingMessage", {
          authorId,
          conversationId: conversation?.id,
        });
        setTimeout(timeoutFunction, 5000);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 5000);
      }
    }
  };
  const { data: authorId, isLoading } = useQuery({
    queryKey: ["users/:username", meUser],
    queryFn: async () => {
      const response = await axiosAuthorized.post("users/findByNickname", {
        username: meUser,
      });
      return response.data;
    },
  });
  if (isLoading) {
    return "isLoading...";
  }
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
