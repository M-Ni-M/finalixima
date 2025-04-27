import { apiClient } from "./config";

export const apiCreateAuction = (formData) => {
  return apiClient.post("/add-item", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
};

export const apiGetAllAuctions = () => {
  return apiClient.get("/all-items");
};

export const apiGetUserAuctions = () => {
  // Get the userId from localStorage or other state management
  const userId = localStorage.getItem("userId");

  // Use the full URL to avoid relative path issues
  return apiClient.get(`/user-item/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    // Increase timeout for this specific request
    timeout: 30000, // 30 seconds
  });
};
export const apiUpdateAuction = (auctionId, payload) => {
  return apiClient.patch(`/update-item/${auctionId}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
};

export const apiDeleteAuctionItem = (id) => {
  return apiClient.delete(`/delete-item/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
};

export const apiGetAuctionById = (id) => {
  return apiClient.get(`/item/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const apiStartAuction = (id) => {
  return apiClient.post(`/start-auction/${id}`, {
    headers: {
      "Content-Type" : "application/json"
    }
  })
}