export const formatTimestamp = (timestamp: number) => {
    const messageDate = new Date(timestamp);

    const day = String(messageDate.getDate()).padStart(2, "0");
    const month = String(messageDate.getMonth() + 1).padStart(2, "0");
    const year = messageDate.getFullYear();

    const hours = String(messageDate.getHours()).padStart(2, "0");
    const minutes = String(messageDate.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }