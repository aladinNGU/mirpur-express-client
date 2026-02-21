import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
});

const useAxiosSecure = () => {
  const { user, LogOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        // Only add token if user exists and has accessToken
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.log("Inside response interceptor", error.response?.status);

        const status = error.response?.status;

        if (status === 403) {
          navigate("/forbidden");
        } else if (status === 401) {
          try {
            await LogOut();
            navigate("/login");
          } catch (logoutError) {
            console.error("Logout failed:", logoutError);
          }
        }

        return Promise.reject(error);
      },
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user?.accessToken, LogOut, navigate]); // Add dependencies

  return axiosSecure;
};

export default useAxiosSecure;
