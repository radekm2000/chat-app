import { Typography } from "@mui/material";
export const ConversationPanel = () => {
  return (
    <Typography
      sx={{
        color: "#fff",
        display: "flex",
        alignItems: 'center',
        justifyContent: "center",
        marginTop: '100px'
      }}
      fontFamily={"Readex Pro"}
      fontSize={"36px"}
    >
      Select your conversation
    </Typography>
  );
};
