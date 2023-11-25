import { useQuery } from "@tanstack/react-query";
import { useAxiosAuthorized } from "./useAxiosAuthorized";
import { Friend } from "../types/types";

export const useFriendsQuery = () => {
  const axiosAuthorized = useAxiosAuthorized();
  return useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axiosAuthorized.get("friends");
      return data as Friend[];
    },
  });
};
