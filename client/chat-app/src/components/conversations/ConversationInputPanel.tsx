import { Input } from "@mui/material";
import { UserType } from "./ConversationNavbar";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosAuthorized } from "../../hooks/useAxiosAuthorized";
import { useSocket } from "../../hooks/useSocket";
import { useUser } from "../../hooks/useUser";
import { getRecipientFromConversation } from "../../utils/getRecipientFromConversation";
import { useChatMsg } from "../../hooks/useChatMsg";
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
  const [typing, setTyping] = useState(false);
  const { meUser } = useUser();
  const { chatMessages, setChatMessages } = useChatMsg();
  // const { data: userData, isLoading } = useQuery({
  //   queryKey: ["users/:username", meUser],
  //   queryFn: findUserByNickname(meUser),
  // });
  // if (isLoading) {
  //   return "isLoading...";
  // }
  // console.log("znaleziony user");
  // console.log(userData);
  let timeout = undefined;
  useEffect(() => {}, [timeout]);

  const timeoutFunction = () => {
    setTyping(false);
    socket.emit("noLongerTypingMessage");
  };
  // else {
  //   if (typing === false) {
  //     setTyping(true);
  //     socket.emit("typingMessage");
  //     setTimeout(timeoutFunction, 5000);
  //   } else {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(timeoutFunction, 5000);
  //   }
  // }

  // const onKeyDownNotEnter = () => {
  //   if (typing === false) {
  //     setTyping(true);
  //     socket.emit("typingMessage", "is typing...");
  //     setTimeout(timeoutFunction, 5000);
  //   } else {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(timeoutFunction, 5000);
  //   }
  // };
  console.log("conversation id: ");
  console.log(conversation?.id);
  // useEffect(() => {
  //   socket.on("getMessage", (msg) => {
  //     console.log("otrzymany event getMessage");
  //     if (conversation.id !== msg.conversation?.id) return;
  //     console.log("otrzymana wiadomosc z socketa");
  //     console.log(msg);
  //     setChatMessages((prev) => [...prev, msg]);
  //   });

  //   return () => {
  //     socket.off("getMessage");
  //   };
  // });
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
      setChatMessages((prev) => [...prev, data.message]);
      console.log(data);
      socket.emit("sendMessage", {
        msg: data?.message,
        // recipientId: data?.message?.recipient?.id,
        recipientId: getRecipientFromConversation(
          data?.updatedConversation,
          meUser
        ).id,
      });
    },
    onError: () => {
      console.log("error");
    },
  });
  // const { username } = user;
  const [message, setMessage] = useState("");
  console.log("wiadomosci z websocket");
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
    } else {
      if (e.key !== 'Backspace' || typing === false) {
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
  console.log("podany nick");
  console.log(meUser);
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
  console.log("znaleziony user");
  console.log(authorId);
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
