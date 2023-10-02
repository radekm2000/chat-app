import { Input } from "@mui/material";
import { UserProps } from "./ConversationNavbar";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAxiosAuthorized } from "../../hooks/useAxiosAuthorized";
export type ConversationInputPanelProps = {
  user: Partial<UserProps>;
};
export const ConversationInputPanel = ({
  user,
}: ConversationInputPanelProps) => {
  const axiosAuthorized = useAxiosAuthorized()
  const mutation = useMutation({
    mutationFn: async() => {
      await axiosAuthorized.post('messages', {content: message})
    },
    onSuccess: () => {
      console.log('wiadomosc wyslana')
    },
    onError: () => {
      console.log('error')
    }
  })
  const { username } = user;
  const [message, setMessage] = useState("");
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      if(message.trim() !== '') {
        const {mutate,error, isError} = mutation
        mutate()
        if(isError) {
          console.log(error)
        }
      }
    }
  };
  return (
    <Input
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={(e) => handleKeyDown(e)}
      inputProps={{ spellCheck: false }}
      placeholder={`Message ${username}`}
      disableUnderline
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
