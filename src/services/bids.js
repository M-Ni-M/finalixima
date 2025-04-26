import { apiClient } from "./config";
import io from "socket.io-client";

// Socket instance
let socket = null;

// Connect to socket server auction namespace
export const connectToAuctionSocket = () => {
  if (!socket) {
    const SOCKET_URL = "http://localhost:3333";
    socket = io(`${SOCKET_URL}/auction`);
    
    socket.on("connect", () => {
      console.log("Connected to auction socket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from auction socket server");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }
  
  return socket;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Join a specific auction room
export const joinAuctionRoom = (auctionId) => {
  if (socket) {
    socket.emit("joinAuction", auctionId);
  }
};

// Send a bid through socket
export const emitBid = (auctionId, amount) => {
  if (socket) {
    socket.emit("placeBid", { auctionId, amount });
  }
};

// API calls for bids
export const apiCreateBid = (auctionId, bidAmount) => {
  return apiClient.post(`/create-bid/${auctionId}`, { bidAmount }, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
};

export const apiGetBidsByAuction = (auctionId) => {
  return apiClient.get(`/auction/bids/${auctionId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
};

export const apiGetUserBids = (userId) => {
  return apiClient.get(`/user/bids/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
};

export const apiDeleteBid = (bidId) => {
  return apiClient.delete(`/delete-bid/${bidId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
};