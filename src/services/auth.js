import { apiClient } from "./config";

export const apiSignup = async (payload) => {
  return apiClient.post("/user/register", payload);
};

export const apiLogin = async (payload) => {
  return apiClient.post("/user/login", payload);
};

export const apiVerifyEmail = async (payload) => {
  return apiClient.post("/user/verify-email", payload);
};
