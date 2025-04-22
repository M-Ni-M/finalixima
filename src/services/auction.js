import { apiClient } from "./Config";

export const apiCreateAuction = (formData) => {
    return apiClient.post("/auctions", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

export const apiGetAllAuctions = () => {
    return apiClient.get("/auctions");
};

export const apiUpdateAuction = (auctionId, payload) => {
    return apiClient.patch(`/update-item/${auctionId}`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

export const apiDeleteAuction = (auctionId) => {
    return apiClient.delete(`/delete-item/${auctionId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};