export const formatTimestampToSidebar = (timestamp: number) => {
  const messageDate = new Date(timestamp);
  const currentDate = new Date();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(currentDate.getDate() - 1);

  const day = String(messageDate.getDate()).padStart(2, "0");
  const month = String(messageDate.getMonth() + 1).padStart(2, "0");
  const year = messageDate.getFullYear();

  const hours = String(messageDate.getHours()).padStart(2, "0");
  const minutes = String(messageDate.getMinutes()).padStart(2, "0");

  if (
    messageDate.getDate() === currentDate.getDate() &&
    messageDate.getMonth() === currentDate.getMonth() &&
    messageDate.getFullYear() === currentDate.getFullYear()
  ) {
    return ` ·Today ${hours}:${minutes}`;
  } else if (
    messageDate.getDate() === yesterdayDate.getDate() &&
    messageDate.getMonth() === yesterdayDate.getMonth() &&
    messageDate.getFullYear() === yesterdayDate.getFullYear()
  ) {
    return ` ·Yesterday ${hours}:${minutes}`;
  } else {
    return ` ·${day}.${month}.${year}`;
  }
};
