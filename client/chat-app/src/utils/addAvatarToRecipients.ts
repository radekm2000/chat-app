import { getAvatarById } from "../api/axios";

export const addAvatarsToRecipients = async (recipients) => {
  return Promise.all(
    recipients.map(async (recipient) => {
      const avatar = await getAvatarById(recipient?.id);

      return {
        ...recipient,
        avatar,
      };
    })
  );
};
