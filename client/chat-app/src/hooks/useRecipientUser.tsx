import { useQuery } from "@tanstack/react-query";
import { useAxiosAuthorized } from "./useAxiosAuthorized";

export const useRecipientUser = (userId: string) => {
  const axiosAuthorized = useAxiosAuthorized();

  return useQuery({
    queryKey: ["users/find", userId],
    queryFn: async () => {
      const { data } = await axiosAuthorized.get(`users/${userId}`);
      return data;
    },
  });
};
