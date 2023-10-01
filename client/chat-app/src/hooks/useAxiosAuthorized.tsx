import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { authApi } from "../api/axios";
import { useRefreshToken } from "./useRefreshToken";

export const useAxiosAuthorized = () => {
  const { auth } = useAuth()
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestInterceptor = authApi.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = authApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          localStorage.setItem('token', newAccessToken)
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return authApi(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      authApi.interceptors.response.eject(responseInterceptor);
      authApi.interceptors.request.eject(requestInterceptor);
    };
  }, [auth]);

  return authApi
};
