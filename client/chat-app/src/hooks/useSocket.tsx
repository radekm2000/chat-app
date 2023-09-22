import { WebsocketContext } from "../contexts/WebsocketContext";
import { useContext } from "react";

export const useSocket = () => {
  return useContext(WebsocketContext);
};
