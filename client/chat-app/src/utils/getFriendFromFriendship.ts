import { Friendship, Person } from "../types/types";

export const getFriendFromFriendship = (
  friendship: Friendship,
  mainUserUsername: string
): Person | null => {
  if (friendship.sender.username === mainUserUsername) {
    return friendship.receiver;
  } else if (friendship.receiver.username === mainUserUsername) {
    return friendship.sender;
  } else {
    return null;
  }
};
