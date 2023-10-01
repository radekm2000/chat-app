/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import axios from "axios";
import { LoginInput, RegisterInput } from "../types/types";
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
  const response = await authApi.post("auth/login", { username, password });
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


