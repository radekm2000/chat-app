/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import axios from "axios";
import {
  ChangePasswordCredentials,
  CreateConversationParams,
  LoginInput,
  RegisterInput,
  SendFriendRequest,
} from "../types/types";
const BASE_URL = "http://localhost:3000/";

export const axiosApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const signUpUser = async ({
  username,
  password,
  email,
}: RegisterInput) => {
  const response = await authApi.post("auth/register", {
    username,
    password,
    email,
  });
  return response.data;
};

export const signInUser = async ({ username, password }: LoginInput) => {
  const response = await authApi.post("auth/login", { username, password }, {});
  return response?.data;
};

export const getAllUsers = async () => {
  try {
    const response = await authApi.get("users");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findUserById = async (userId: number) => {
  const accessToken = localStorage.getItem("token");

  try {
    const response = await authApi.post("users/find", userId, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (imgFile) => {
  const response = await authApi.post("users/upload", imgFile);
  return response.data;
};

export const findUserByNickname = async (username: string) => {
  const accessToken = localStorage.getItem("token");

  try {
    const response = await authApi.post(
      "users/findByNickname",
      { username: username },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createConversationApi = async ({
  username,
  message,
}: CreateConversationParams) => {
  const accessToken = localStorage.getItem("token");
  try {
    const response = await authApi.post(
      "conversations",
      {
        username,
        message: "First Message",
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserConversations = async () => {
  const accessToken = localStorage.getItem("token");
  try {
    const response = await authApi.get("conversations", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvatarById = async (userId: number) => {
  const accessToken = localStorage.getItem("token");
  try {
    const response = await authApi.get(`avatars/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendEmailAndFindUserToResetPassword = async (email: string) => {
  try {
    const response = await axiosApi.post("auth/verifyEmail", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePasswordCredentials = async ({
  password,
  confirmPassword,
  token,
  userId,
}: ChangePasswordCredentials) => {
  try {
    const response = await axiosApi.post("auth/changePassword", {
      password,
      confirmPassword,
      token,
      userId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendFriendRequest = async ({
  username,
  userId,
}: SendFriendRequest) => {
  const response = await authApi.post("friend-requests", {
    username,
    userId,
  });
  return response.data;
};

export const acceptFriendRequest = async (friendRequestId: number) => {
  const response = await authApi.patch(
    `friend-requests/${friendRequestId}/accept`
  );
  return response.data;
};

export const rejectFriendRequest = async (friendRequestId: number) => {
  const response = await authApi.patch(
    `friend-requests/${friendRequestId}/reject`
  );
  return response.data;
};

export const deleteFriendRecord = async (friendRecordId: number) => {
  const response = await authApi.delete(`friends/${friendRecordId}`);
  return response.data;
};
