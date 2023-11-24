import { useQuery } from "@tanstack/react-query";
import { useAxiosAuthorized } from "./useAxiosAuthorized";
import { FriendRequest } from "../types/types";

export const useFriendRequestsQuery = () => {
  const axiosAuthorized = useAxiosAuthorized();

  return useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const { data } = await axiosAuthorized.get("friend-requests");
      return data as FriendRequest[];
    },
  });
};
