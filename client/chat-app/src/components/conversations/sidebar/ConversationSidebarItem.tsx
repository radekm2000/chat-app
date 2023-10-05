/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from "@mui/material";
import users from "../../../users.json";
import { useQuery } from "@tanstack/react-query";
import { useAxiosAuthorized } from "../../../hooks/useAxiosAuthorized";
import { authApi, getAllUsers } from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";
import { Redirect, useLocation } from "wouter";
import crypto from "crypto";

import { ConversationChannelPage } from "../ConversationChannelPage";
import { useRefreshToken } from "../../../hooks/useRefreshToken";
import { useSocket } from "../../../hooks/useSocket";
import useId from "@mui/material/utils/useId";
type User = {
  id: string;
  username: string;
};

type UsersData = User[];

export const SidebarItem = () => {
  // const socket = useSocket()
  const [location, setLocation] = useLocation();
  const { auth } = useAuth();
  const axiosAuthorized = useAxiosAuthorized();
  // const { data } = useQuery<UsersData>({
  //   queryKey: ["users"],
  //   queryFn: getAllUsers,
  // });
  const handleUserChatClick = async (userId: string) => {
    setLocation(`/conversations/${userId}`);
  };

  const { data } = useQuery<UsersData>(["users/get"], async () => {
    try {
      const response = await axiosAuthorized.get("users");
      return response.data;
    } catch (error) {
      return;
    }
  });
  return (
    <Box>
      {data?.map((user) => (
        <>
          <Box
            sx={{
              padding: "13px 0px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderBottom: "1px solid rgb(40, 40,40)",
              ":hover": {
                backgroundColor: "rgb(40, 40,40)",
                opacity: "0.8",
                borderRadius: "2%",
              },
            }}
            onClick={() => handleUserChatClick(user.id)}
          >
            <Box
              sx={{
                width: "48px",
                height: "48px",
                backgroundColor: "blue",
                borderRadius: "50%",
              }}
            ></Box>
            <Box>
              <Typography
                fontFamily={"Readex pro"}
                sx={{ fontSize: "23px", fontWeight: "500", color: "white" }}
              >
                {user.username}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#A3A3A3" }}>
                {/* {user.lastMessage || null} */ `jakas wiadomosc`}
              </Typography>
            </Box>
          </Box>
        </>
      ))}
    </Box>
  );
};
