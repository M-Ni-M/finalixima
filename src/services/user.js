import { apiClient } from "./config";

export const apiUpdateUserProfile = (payload) => {
    return apiClient.patch("/user/profile", payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
};