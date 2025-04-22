import { apiClient } from "./Config";

export const apiUpdateUserProfile = (payload) => {
    return apiClient.patch("/user/profile", payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};