import { Box, Typography } from "@mui/material";
import users from "../../../users.json";
export const SidebarItem = () => {
  return (
    <Box
    >
      {users.map((user) => (
        <>
          <Box sx={{padding: '13px 0px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #808080', ":hover": {backgroundColor: '#DDDDDD', opacity: '0.8', borderRadius: '2%'}}}>
            <Box
              sx={{
                width: "48px",
                height: "48px",
                backgroundColor: "blue",
                borderRadius: "50%",
                
              }}
            ></Box>
            <Box >
              <Typography fontFamily={'Readex pro'} sx={{ fontSize: "23px", fontWeight: "500", color: 'white' }}>
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
