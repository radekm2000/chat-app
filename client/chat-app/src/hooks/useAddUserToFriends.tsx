import { useAxiosAuthorized } from "./useAxiosAuthorized";
type SendFriendRequestInput = {
  username: string;
  userId: number;
};

export const useAddUserToFriends = async ({
  username,
  userId,
}: SendFriendRequestInput) => {
  const axiosAuthorized = useAxiosAuthorized();
  const { data } = await axiosAuthorized.post("friend-requests", {
    username,
    userId,
  });
  return data;
};
