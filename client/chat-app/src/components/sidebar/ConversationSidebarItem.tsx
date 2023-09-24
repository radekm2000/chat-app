import { Box, Typography } from "@mui/material";
import users from "../../users.json";
export const SidebarItem = () => {
  return (
    <Box
    >
      {users.map((user) => (
        <>
          <Box sx={{padding: '13px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #fff',}}>
            <Box
              sx={{
                width: "48px",
                height: "48px",
                backgroundColor: "blue",
                borderRadius: "50%",
              }}
            ></Box>
            <Box>
              <Typography sx={{ fontSize: "16px", fontWeight: "500", color: 'white' }}>
                {user.username}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#A3A3A3" }}>
                {user.lastMessage}
              </Typography>
            </Box>
          </Box>
        </>
      ))}
    </Box>
  );
};
