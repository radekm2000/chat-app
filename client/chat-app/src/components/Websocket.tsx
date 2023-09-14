import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";

type MessagePayload = {
  msg: string;
  content: string;
};
export const Websocket = () => {
  const [value, setValue] = useState("");
  const socket = useContext(WebsocketContext);
  const [messages, setMessages] = useState<MessagePayload[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("client connected on frontend");
    });

    socket.on("onMessage", (newMessage: MessagePayload) => {
      console.log(`onMessage event received on frontend`);
      console.log(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      console.log("cleanup useEffect function");
      socket.off("connect");
      socket.off("onMessage");
    };
  }, []);

  const onSubmit = () => {
    socket.emit("newMessage", value);
    setValue("");
  };

  return (
    <>
      <div>Websocket component</div>
      <div>{messages.length === 0 ? <div>No messages</div> : <div>{messages.map((msg) => <div>
        <p>{msg.content}</p>
      </div>)}</div>}</div>
      <input
        type="text"
        id="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={onSubmit}>Submit</button>
    </>
  );
};
