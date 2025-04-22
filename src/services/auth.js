import { apiClient } from "./Config";

export const apiRegisterUser = (payload) => {
    return apiClient.post("/user/register", payload);
};

export const apiUserLogin = (payload) => {
    return apiClient.post("/user/login", payload);
};

export const apiVerifyEmail = (payload) => {
    return apiClient.post("/user/verify-email", payload);
};