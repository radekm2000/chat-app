import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export const useUser = () => {
  const context = useContext(UserContext)
  if(context === undefined) {
    throw new Error('useUser context must be used within userContextProvider')
  }
  return context
};
