import { useQuery } from "@tanstack/react-query";
import { useAxiosAuthorized } from "./useAxiosAuthorized";
import { Conversation } from "../types/types";

export const useUserConversationQuery = (userId: number) => {
  const axiosAuthorized = useAxiosAuthorized();

  return useQuery({
    queryKey: [`conversations`, userId],
    queryFn: async () => {
      const { data } = await axiosAuthorized.get(`conversations/${userId}`);
      return data as Conversation;
    },
  });
};
