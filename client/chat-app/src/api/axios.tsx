import axios from "axios";
import { LoginInput, RegisterInput } from "../types/types";

const BASE_URL = "http://localhost:3000/";

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
