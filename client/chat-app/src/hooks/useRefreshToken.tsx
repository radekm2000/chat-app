/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "./useAuth";
import { authApi } from "../api/axios";

export const useRefreshToken = () => {
  const { setAuth, auth } = useAuth();
  const refresh = async () => {
    try {
      const response = await authApi.get("auth/refresh");
      setAuth!((prev) => {
        return { ...prev, accessToken: response.data };
      });
      return response.data;
    } catch (error) {
      return;
    }
  };
  return refresh;
};
