/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import axios from "axios";
import {
  CreateConversationParams,
  LoginInput,
  RegisterInput,
} from "../types/types";
import { useAxiosAuthorized } from "../hooks/useAxiosAuthorized";
import { useAuth } from "../hooks/useAuth";
const BASE_URL = "http://localhost:3000/";

export default axios.create({
  baseURL: BASE_URL,
});

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const signUpUser = async ({ username, password }: RegisterInput) => {
  const response = await authApi.post("auth/register", { username, password });
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

