import React, { useState, useEffect, useCallback } from "react";
import BackButton from "../components/BackButton";
import { useParams } from "react-router-dom";
import { apiGetAuctionById } from "../services/auction";
import { 
  connectToAuctionSocket, 
  disconnectSocket, 
  joinAuctionRoom, 
  emitBid, 
  apiCreateBid,
  apiGetBidsByAuction
} from "../services/bids";
import { toast } from "react-toastify";

const AuctionRoom = () => {
  const { id: auctionId } = useParams();
  const [socket, setSocket] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [startingBid, setStartingBid] = useState(0);
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidding, setBidding] = useState(false);
  const [auctionState, setAuctionState] = useState("loading"); // "loading", "active", "ended"
  const [winner, setWinner] = useState(null);

  // Fetch auction details and bids
  const fetchAuctionData = useCallback(async () => {
    try {
      if (!auctionId) {
        throw new Error("Auction ID is missing");
      }
      
      setLoading(true);
      const { data } = await apiGetAuctionById(auctionId);
      console.log("Auction Data:", data);
      setAuction(data);
      setCurrentBid(data.currentBid || data.startingBid);
      setStartingBid(data.startingBid);
      
      // Calculate time left
      if (data.endTime) {
        const endTime = new Date(data.endTime).getTime();
        const now = new Date().getTime();
        const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(timeRemaining);
        
        // Set auction state based on time remaining
        if (timeRemaining > 0) {
          setAuctionState("active");
        } else {
          setAuctionState("ended");
        }
      }
      
      // Fetch bids for this auction
      // const bidsResponse = await apiGetBidsByAuction(auctionId);
      // console.log("Bid Response:", bidsResponse);
      // if (bidsResponse.data && bidsResponse.data.bids) {
      //   // Sort bids by amount in descending order
      //   const sortedBids = bidsResponse.data.bids.sort((a, b) => b.bidAmount - a.bidAmount);
      //   setBids(sortedBids);
        
      //   // Set winner if auction has ended
      //   if (timeRemaining <= 0 && sortedBids.length > 0) {
      //     setWinner(sortedBids[0]);
      //   }
      // }
    } catch (err) {
      console.error("Error fetching auction data:", err);
      setError(`Failed to load auction data: ${err.message}`);
      toast.error(`Failed to load auction data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  // Initialize socket connection
  useEffect(() => {
    // Only connect if we have a valid auctionId
    if (!auctionId) {
      setError("No auction ID provided");
      setLoading(false);
      return;
    }
    
    const socketInstance = connectToAuctionSocket();
    setSocket(socketInstance);
    
    // Join the auction room
    joinAuctionRoom(auctionId);
    
    // Fetch initial data
    fetchAuctionData();
    
    return () => {
      disconnectSocket();
    };
  }, [auctionId, fetchAuctionData]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Listen for welcome message
    socket.on("welcome", (data) => {
      console.log("Socket welcome:", data);
    });
    
    // Listen for user joined events
    socket.on("userJoined", (data) => {
      console.log("User joined:", data);
      toast.info(`New user has joined the auction`);
    });
    
    // Listen for new bids
    socket.on("newBid", (bidData) => {
      console.log("New bid received:", bidData);
      localStorage.setItem("newBid", currentBid)
      
      // Only process new bids if auction is active
      if (auction.status === "active") {
        // Update current bid if it's higher
        if (bidData.amount > currentBid) {
          setCurrentBid(bidData.amount);
          
          // Add the new bid to our list
          const newBid = {
            id: Date.now().toString(), // Temporary ID for new bids
            bidAmount: bidData.amount,
            userId: bidData.bidder,
            bidTime: bidData.timestamp,
            userName: bidData.bidder === socket.id ? "You" : `User ${bidData.bidder.substring(0, 5)}...`
          };
          
          setBids(prevBids => {
            const updatedBids = [newBid, ...prevBids].sort((a, b) => b.bidAmount - a.bidAmount);
            return updatedBids;
          });
          
          // Show toast notification for new bid
          if (bidData.bidder !== socket.id) {
            toast.info(`New bid: ${formatCurrency(bidData.amount)}`);
          }
        }
      }
    });
    
    // Clean up listeners
    return () => {
      socket.off("welcome");
      socket.off("userJoined");
      socket.off("newBid");
    };
  }, [socket, currentBid, auctionId, auctionState]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      // Auction has ended
      setAuctionState("ended");
      
      // Set winner when auction ends
      if (bids.length > 0) {
        setWinner(bids[0]);
      }
      
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev > 0 ? prev - 1 : 0;
        
        // When timer reaches zero, end the auction
        if (newTime === 0) {
          setAuctionState("ended");
          
          // Set winner when auction ends
          if (bids.length > 0) {
            setWinner(bids[0]);
          }
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, bids]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  
  
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `₵${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `₵${(amount / 1000).toFixed(2)}K`;
    }
    return `₵${amount.toFixed(2)}`;
  };

  const handleBid = async () => {
    // Don't allow bidding if auction has ended
    if (auction.status !== "active") {
      toast.error("Auction has ended. Bidding is no longer allowed.");
      return;
    }
    
    const amount = parseInt(bidAmount);
    
    if (isNaN(amount)) {
      toast.error("Please enter a valid bid amount");
      return;
    }
    
    if (amount <= currentBid) {
      toast.error(`Bid must be higher than current bid (${formatCurrency(currentBid)})`);
      return;
    }
    
    if (amount < startingBid) {
      toast.error(`Bid must be at least the starting bid (${formatCurrency(startingBid)})`);
      return;
    }
    
    try {
      setBidding(true);
      
      // Send bid to server via API
      await apiCreateBid(auctionId, amount);
      
      // Emit socket event for real-time updates
      emitBid(auctionId, amount);
      
      // Update UI optimistically (will be confirmed by socket event)
      setCurrentBid(amount);
      
      toast.success("Bid placed successfully!");
      setBidAmount("");
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error(error.response?.data?.message || "Failed to place bid");
    } finally {
      setBidding(false);
    }
  };

  const handleQuickBid = () => {
    // Don't allow quick bidding if auction has ended
    if (auction.status !== "active") {
      toast.error("Auction has ended. Bidding is no longer allowed.");
      return;
    }
    
    // Set bid amount to current bid plus increment (10% or minimum 1000)
    const increment = Math.max(1000, Math.round(currentBid * 0.1));
    const quickBidAmount = currentBid + increment;
    setBidAmount(quickBidAmount.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading auction data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div 
      style={{ backgroundImage: "url('/images/bg.png')" }}
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <BackButton/>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 font-[MuseoModerno]">
          {/* Property Info */}
          <div className="w-full lg:w-1/2 h-auto min-h-[70vh] sm:h-[70vh] bg-white flex flex-col items-center rounded-xl border border-gray-300 shadow overflow-hidden">
            <div className="w-full h-48 sm:h-2/3 bg-blue-500 rounded-t-xl">
              {auction?.image && (
                <img 
                  src={`https://res.cloudinary.com/dyfpxokoj/image/upload/${auction.image}`} 
                  alt={auction.title} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4 w-full text-center">
              <h2 className="text-lg sm:text-xl font-semibold">{auction?.title || "Property"}</h2>
              
              {/* Countdown Timer - Made more visible */}
              <div className={`py-2 px-4 rounded-lg ${auction.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} inline-block font-bold my-2`}>
                {auction.status === "active" ? `Bidding Ends in: ${formatTime(timeLeft)}` : "Auction Ended"}
              </div>
              
              <p className="text-base sm:text-lg font-bold mt-2">
                Start Bid: {formatCurrency(startingBid)}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Auction ID: {auctionId || "N/A"}
              </p>
              <p className="text-xs sm:text-sm text-black">
                Location: {auction?.location || "Ghana, Accra"}
              </p>
              {auction?.description && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  {auction.description}
                </p>
              )}
            </div>
          </div>

          {/* Bidding Section */}
          <div className="w-full lg:w-1/2 h-auto min-h-[50vh] sm:h-[70vh] bg-white border border-gray-300 rounded-xl shadow p-3 sm:p-4 flex flex-col">
            <div className="mb-3 sm:mb-4">
              <p className="text-red-500 font-bold uppercase text-sm sm:text-base">
                Auction Information
              </p>
              <h1 className="text-xl sm:text-2xl font-bold mt-1">
                Current Bid: {formatCurrency(currentBid)}
              </h1>
              
              {/* Winner Display */}
              {auction.status === "ended" && winner && (
                <div className="mt-2 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded-md">
                  <p className="font-bold text-yellow-800">
                    Auction Winner: {winner.userName || "Unknown"}
                  </p>
                  <p className="text-yellow-700">
                    Winning Bid: {formatCurrency(winner.bidAmount)}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-100 flex-1 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 overflow-y-auto">
              <h2 className="font-semibold mb-2 text-sm sm:text-base">Bid History</h2>
              {bids.length > 0 ? (
                <div className="space-y-2">
                  {bids.map((bid, index) => (
                    <div 
                      key={bid.id || index} 
                      className={`flex justify-between p-2 sm:p-3 bg-white rounded-lg shadow ${index === 0 ? 'border-l-4 border-green-500' : ''}`}
                    >
                      <p className="font-medium text-sm sm:text-base">
                        {bid.userName || (bid.userId === socket?.id ? "You" : `User ${bid.userId.substring(0, 5)}...`)}
                      </p>
                      <p className="font-semibold text-sm sm:text-base">
                        {formatCurrency(bid.bidAmount)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm sm:text-base">No bids yet</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="number"
                id="bidAmount"
                placeholder="Enter your bid (cedis)"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                disabled={auction.status !== "active" || bidding}
                className={`flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${auction.status !== "active" ? "bg-gray-100" : ""}`}
              />
              <div className="flex gap-2 sm:gap-3">
                <button
                  className={`bg-red-500 hover:bg-red-600 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base flex-1 ${(auction.status !== "active" || bidding) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleBid}
                  disabled={auction.status !== "active" || bidding}
                >
                  {bidding ? "BIDDING..." : "PLACE BID"}
                </button>
                <button
                  className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base whitespace-nowrap ${(auction.status !== "active" || bidding) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleQuickBid}
                  disabled={auction.status!== "active" || bidding}
                >
                  QUICK BID
                </button>
              </div>
            </div>
            
            {/* Message when auction has ended */}
            {auction.status === "ended" && (
              <div className="mt-3 p-2 text-center bg-gray-100 rounded-lg">
                <p className="text-gray-700">Bidding is now closed for this auction.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;


// import React, { useState, useEffect, useCallback } from "react";
// import BackButton from "../components/BackButton";
// import { useParams } from "react-router-dom";
// import { apiGetAuctionById } from "../services/auction";
// import { 
//   connectToAuctionSocket, 
//   disconnectSocket, 
//   joinAuctionRoom, 
//   emitBid, 
//   apiCreateBid,
//   apiGetBidsByAuction
// } from "../services/bids";
// import { toast } from "react-toastify";

// const AuctionRoom = () => {
//   const { id } = useParams();
//   const [socket, setSocket] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [currentBid, setCurrentBid] = useState(0);
//   const [startingBid, setStartingBid] = useState(0);
//   const [auction, setAuction] = useState(null);
//   const [bids, setBids] = useState([]);
//   const [bidAmount, setBidAmount] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [bidding, setBidding] = useState(false);

//   // Fetch auction details and bids
//   const fetchAuctionData = useCallback(async () => {
//     try {
//       if (!id) {
//         throw new Error("Auction ID is missing");
//       }
      
//       setLoading(true);
//       const { data } = await apiGetAuctionById(id);
//       console.log("Auction Data:", data);
//       setAuction(data);
//       setCurrentBid(data.currentBid || data.startingBid);
//       setStartingBid(data.startingBid);
      
//       // Calculate time left
//       if (data.endDate) {
//         const endTime = new Date(data.endDate).getTime();
//         const now = new Date().getTime();
//         const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
//         setTimeLeft(timeRemaining);
//       }
      
//       // Fetch bids for this auction
//       const bidsResponse = await apiGetBidsByAuction(id);
//       console.log("Bid Response:", bidsResponse);
//       if (bidsResponse.data && bidsResponse.data.bids) {
//         // Sort bids by amount in descending order
//         const sortedBids = bidsResponse.data.bids.sort((a, b) => b.bidAmount - a.bidAmount);
//         setBids(sortedBids);
//       }
//     } catch (err) {
//       console.error("Error fetching auction data:", err);
//       setError(`Failed to load auction data: ${err.message}`);
//       toast.error(`Failed to load auction data: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   // Initialize socket connection
//   useEffect(() => {
//     // Only connect if we have a valid auctionId
//     if (!id) {
//       setError("No auction ID provided");
//       setLoading(false);
//       return;
//     }
    
//     const socketInstance = connectToAuctionSocket();
//     setSocket(socketInstance);
    
//     // Join the auction room
//     joinAuctionRoom(id);
    
//     // Fetch initial data
//     fetchAuctionData();
    
//     return () => {
//       disconnectSocket();
//     };
//   }, [id, fetchAuctionData]);

//   // Set up socket event listeners
//   useEffect(() => {
//     if (!socket) return;
    
//     // Listen for welcome message
//     socket.on("welcome", (data) => {
//       console.log("Socket welcome:", data);
//     });
    
//     // Listen for user joined events
//     socket.on("userJoined", (data) => {
//       console.log("User joined:", data);
//       toast.info(`New user has joined the auction`);
//     });
    
//     // Listen for new bids
//     socket.on("newBid", (bidData) => {
//       console.log("New bid received:", bidData);
      
//       // Update current bid if it's higher
//       if (bidData.amount > currentBid) {
//         setCurrentBid(bidData.amount);
        
//         // Add the new bid to our list
//         const newBid = {
//           id: Date.now().toString(), // Temporary ID for new bids
//           bidAmount: bidData.amount,
//           userId: bidData.bidder,
//           bidTime: bidData.timestamp,
//           userName: bidData.bidder === socket.id ? "You" : `User ${bidData.bidder.substring(0, 5)}...`
//         };
        
//         setBids(prevBids => [newBid, ...prevBids].sort((a, b) => b.bidAmount - a.bidAmount));
        
//         // Show toast notification for new bid
//         if (bidData.bidder !== socket.id) {
//           toast.info(`New bid: ${formatCurrency(bidData.amount)}`);
//         }
//       }
//     });
    
//     // Clean up listeners
//     return () => {
//       socket.off("welcome");
//       socket.off("userJoined");
//       socket.off("newBid");
//     };
//   }, [socket, currentBid, id]);

//   // Countdown timer
//   useEffect(() => {
//     if (timeLeft <= 0) return;
    
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);
    
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const formatTime = (seconds) => {
//     if (seconds <= 0) return "Auction Ended";
    
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
    
//     if (hours > 0) {
//       return `${hours}h : ${String(minutes).padStart(2, "0")}m : ${String(secs).padStart(2, "0")}s`;
//     }
//     return `${minutes}m : ${String(secs).padStart(2, "0")}s`;
//   };
  
//   const formatCurrency = (amount) => {
//     if (amount >= 1000000) {
//       return `₵${(amount / 1000000).toFixed(2)}M`;
//     } else if (amount >= 1000) {
//       return `₵${(amount / 1000).toFixed(2)}K`;
//     }
//     return `₵${amount.toFixed(2)}`;
//   };

//   const handleBid = async () => {
//     const amount = parseInt(bidAmount);
    
//     if (isNaN(amount)) {
//       toast.error("Please enter a valid bid amount");
//       return;
//     }
    
//     if (amount <= currentBid) {
//       toast.error(`Bid must be higher than current bid (${formatCurrency(currentBid)})`);
//       return;
//     }
    
//     if (amount < startingBid) {
//       toast.error(`Bid must be at least the starting bid (${formatCurrency(startingBid)})`);
//       return;
//     }
    
//     try {
//       setBidding(true);
      
//       // Send bid to server via API
//       await apiCreateBid(auctionId, amount);
      
//       // Emit socket event for real-time updates
//       emitBid(auctionId, amount);
      
//       // Update UI optimistically (will be confirmed by socket event)
//       setCurrentBid(amount);
      
//       toast.success("Bid placed successfully!");
//       setBidAmount("");
//     } catch (error) {
//       console.error("Error placing bid:", error);
//       toast.error(error.response?.data?.message || "Failed to place bid");
//     } finally {
//       setBidding(false);
//     }
//   };

//   const handleQuickBid = () => {
//     // Set bid amount to current bid plus increment (10% or minimum 1000)
//     const increment = Math.max(1000, Math.round(currentBid * 0.1));
//     const quickBidAmount = currentBid + increment;
//     setBidAmount(quickBidAmount.toString());
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-lg">Loading auction data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-lg text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div 
//       style={{ backgroundImage: "url('/images/bg.png')" }}
//       className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
//     >
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Back Button */}
//         <BackButton/>

//         {/* Main Content */}
//         <div className="flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 font-[MuseoModerno]">
//           {/* Property Info */}
//           <div className="w-full lg:w-1/2 h-auto min-h-[50vh] sm:h-[70vh] bg-white flex flex-col items-center rounded-xl border border-gray-300 shadow overflow-hidden">
//             <div className="w-full h-48 sm:h-2/3 bg-blue-500 rounded-t-xl">
//               {auction?.image && (
//                 <img 
//                   src={auction.image} 
//                   alt={auction.title} 
//                   className="w-full h-full object-cover"
//                 />
//               )}
//             </div>
//             <div className="p-4 w-full text-center">
//               <h2 className="text-lg sm:text-xl font-semibold">{auction?.title || "Property"}</h2>
//               <p className="text-red-500 text-sm sm:text-base">
//                 {timeLeft > 0 ? `Bidding Ends - ${formatTime(timeLeft)}` : "Auction Ended"}
//               </p>
//               <p className="text-base sm:text-lg font-bold mt-2">
//                 Start Bid: {formatCurrency(startingBid)}
//               </p>
//               <p className="text-xs sm:text-sm text-gray-400 mt-1">
//                 Auction ID: {auctionId || "N/A"}
//               </p>
//               <p className="text-xs sm:text-sm text-black">
//                 Location: {auction?.location || "Ghana, Accra"}
//               </p>
//               {auction?.description && (
//                 <p className="text-xs sm:text-sm text-gray-600 mt-2">
//                   {auction.description}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Bidding Section */}
//           <div className="w-full lg:w-1/2 h-auto min-h-[50vh] sm:h-[70vh] bg-white border border-gray-300 rounded-xl shadow p-3 sm:p-4 flex flex-col">
//             <div className="mb-3 sm:mb-4">
//               <p className="text-red-500 font-bold uppercase text-sm sm:text-base">
//                 Auction Information
//               </p>
//               <h1 className="text-xl sm:text-2xl font-bold mt-1">
//                 Current Bid: {formatCurrency(currentBid)}
//               </h1>
//             </div>

//             <div className="bg-gray-100 flex-1 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 overflow-y-auto">
//               <h2 className="font-semibold mb-2 text-sm sm:text-base">Bid History</h2>
//               {bids.length > 0 ? (
//                 <div className="space-y-2">
//                   {bids.map((bid, index) => (
//                     <div 
//                       key={bid.id || index} 
//                       className={`flex justify-between p-2 sm:p-3 bg-white rounded-lg shadow ${index === 0 ? 'border-l-4 border-green-500' : ''}`}
//                     >
//                       <p className="font-medium text-sm sm:text-base">
//                         {bid.userName || (bid.userId === socket?.id ? "You" : `User ${bid.userId.substring(0, 5)}...`)}
//                       </p>
//                       <p className="font-semibold text-sm sm:text-base">
//                         {formatCurrency(bid.bidAmount)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-sm sm:text-base">No bids yet</p>
//               )}
//             </div>

//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
//               <input
//                 type="number"
//                 placeholder="Enter your bid (cedis)"
//                 value={bidAmount}
//                 onChange={(e) => setBidAmount(e.target.value)}
//                 disabled={timeLeft <= 0 || bidding}
//                 className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//               />
//               <div className="flex gap-2 sm:gap-3">
//                 <button
//                   className={`bg-red-500 hover:bg-red-600 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base flex-1 ${(timeLeft <= 0 || bidding) ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   onClick={handleBid}
//                   disabled={timeLeft <= 0 || bidding}
//                 >
//                   {bidding ? "BIDDING..." : "PLACE BID"}
//                 </button>
//                 <button
//                   className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base whitespace-nowrap ${(timeLeft <= 0 || bidding) ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   onClick={handleQuickBid}
//                   disabled={timeLeft <= 0 || bidding}
//                 >
//                   QUICK BID
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuctionRoom;



// import BackButton from "../components/BackButton";

// const AuctionRoom = ({ duration = 2147 }) => {
//   const [timeLeft, setTimeLeft] = useState(duration);
//   const [currentBid, setCurrentBid] = useState(10000000); // Starting bid in cedis
//   const [bids, setBids] = useState([]);
//   const [bidAmount, setBidAmount] = useState("");

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (seconds) =>
//     `${Math.floor(seconds / 60)}m : ${String(seconds % 60).padStart(2, "0")}s`;
//   const formatCurrency = (amount) => `₵${(amount / 1000000).toFixed(2)}M`;

//   const addBid = (amount) => {
//     if (amount > currentBid) {
//       setCurrentBid(amount);
//       setBids([{ name: "You", bid: amount }, ...bids]);
//     }
//   };

//   const handleBid = () => {
//     const amount = parseInt(bidAmount);
//     if (!isNaN(amount)) addBid(amount);
//     setBidAmount("");
//   };

//   const handleQuickBid = () => addBid(currentBid + 1000000);

//   const topBid = bids.length > 0 ? bids[0] : null;

//   return (
//     <div 
//       style={{ backgroundImage: "url('/images/bg.png')" }}
//       className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
//     >
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Back Button */}
//         <BackButton/>


//         {/* Main Content */}
//         <div className="flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 font-[MuseoModerno]">
//           {/* Property Info */}
//           <div className="w-full lg:w-1/2 h-auto min-h-[50vh] sm:h-[70vh] bg-white flex flex-col items-center rounded-xl border border-gray-300 shadow overflow-hidden">
//             <div className="w-full h-48 sm:h-2/3 bg-blue-500 rounded-t-xl"></div>
//             <div className="p-4 w-full text-center">
//               <h2 className="text-lg sm:text-xl font-semibold">Farmhouse 1</h2>
//               <p className="text-red-500 text-sm sm:text-base">
//                 Bidding Ends - {formatTime(timeLeft)}
//               </p>
//               <p className="text-base sm:text-lg font-bold mt-2">
//                 Start Bid: ₵10 Million
//               </p>
//               <p className="text-xs sm:text-sm text-gray-400 mt-1">
//                 Auction ID: 3450987
//               </p>
//               <p className="text-xs sm:text-sm text-black">
//                 Location: Ghana, Accra
//               </p>
//             </div>
//           </div>

//           {/* Bidding Section */}
//           <div className="w-full lg:w-1/2 h-auto min-h-[50vh] sm:h-[70vh] bg-white border border-gray-300 rounded-xl shadow p-3 sm:p-4 flex flex-col">
//             <div className="mb-3 sm:mb-4">
//               <p className="text-red-500 font-bold uppercase text-sm sm:text-base">
//                 Auction Information
//               </p>
//               <h1 className="text-xl sm:text-2xl font-bold mt-1">
//                 My Current Bid : {formatCurrency(currentBid)}
//               </h1>
//             </div>

//             <div className="bg-gray-100 flex-1 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 overflow-y-auto">
//               <h2 className="font-semibold mb-2 text-sm sm:text-base">Top Bid</h2>
//               {topBid ? (
//                 <div className="flex justify-between p-2 sm:p-3 bg-white rounded-lg shadow">
//                   <p className="font-medium text-sm sm:text-base">{topBid.name}</p>
//                   <p className="font-semibold text-sm sm:text-base">
//                     {formatCurrency(topBid.bid)}
//                   </p>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-sm sm:text-base">No bids yet</p>
//               )}
//             </div>

//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
//               <input
//                 type="number"
//                 placeholder="Enter your bid (cedis)"
//                 value={bidAmount}
//                 onChange={(e) => setBidAmount(e.target.value)}
//                 className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//               />
//               <div className="flex gap-2 sm:gap-3">
//                 <button
//                   className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base flex-1"
//                   onClick={handleBid}
//                 >
//                   PLACE BID
//                 </button>
//                 <button
//                   className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base whitespace-nowrap"
//                   onClick={handleQuickBid}
//                 >
//                   +₵1M
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuctionRoom;