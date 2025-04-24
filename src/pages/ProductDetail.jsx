import React, { useEffect, useState } from "react";
// import img from "./components/bag.png";
// import { Link } from "react-router";
import Nav from "../components/Nav";
import Carousel from "../components/Carousel";
import { useNavigate, useParams } from "react-router";
import { apiGetAuctionById } from "../services/auction";

export const ProductDetail = () => {
  const params = useParams();
  console.log("All URL params:", params);  // Debug: Log all params
  
  const { id } = params;
  console.log("ID from params:", id); 
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError("No item ID provided");
          setLoading(false);
          return;
        }
        
        const response = await apiGetAuctionById(id);
        console.log("API Response:", response.data); // Add this to debug the response
        
        if (response.data) {
          // Set the entire item object, not just the ID
          setItem(response.data);
          
          // Check if current user is the owner
          const userId = localStorage.getItem("userId");
          setIsOwner(userId === response.data.id);
        } else {
          setError("Item details not found");
        }
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError("Failed to load item details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails(); // Don't pass any parameters here
  }, [id]);

  const handleStartAuction = async () => {
    try {
      // Here you would implement the API call to start the auction
      // For now, we'll just navigate to an auction room (which you'll create later)
      navigate(`/auction-room/${id}`);
    } catch (error) {
      console.error("Error starting auction:", error);
    }
  };

  const handleJoinAuction = () => {
    navigate(`/auction-room/${id}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Calculate time left until auction end
  const calculateTimeLeft = (endTime) => {
    if (!endTime) return "N/A";
    
    const now = new Date();
    const end = new Date(endTime);
    const timeLeft = end - now;
    
    if (timeLeft <= 0) return "Ended";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}D ${hours}H ${minutes}min`;
  };

  if (loading) {
    return (
      <>
        <Nav />
        <section className="w-full h-screen flex items-center justify-center bg-[#F2F2F2] pt-[4vh]">
          <p className="font-[MuseoModerno] text-xl">Loading item details...</p>
        </section>
      </>
    );
  }

  if (error || !item) {
    return (
      <>
        <Nav />
        <section className="w-full h-screen flex flex-col items-center justify-center bg-[#F2F2F2] pt-[4vh]">
          <p className="font-[MuseoModerno] text-xl text-red-600">{error || "Item not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-5 p-3 bg-red-600 text-white rounded-md"
          >
            Go Back
          </button>
        </section>
      </>
    );
  }

  const auctionStatus = new Date(item.endTime) > new Date() 
    ? item.isActive 
      ? "Active" 
      : "Upcoming"
    : "Ended";

  return (
    <>
      <Nav />
      <section className="w-full min-h-screen flex items-center bg-[#F2F2F2] pt-[4vh] gap-5 px-5">
        <div className="w-full px-10 fixed flex items-start">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="font-[MuseoModerno] font-bold text-2xl text-black hover:text-gray-600 cursor-pointer"
          >
            ← Go Back
          </button>
        </div>
        
        <div className="w-[40vw] h-[70vh] flex items-center justify-center rounded-2xl bg-gray-600 mt-16">
          {item.image ? (
            <img 
              src={`https://res.cloudinary.com/dyfpxokoj/image/upload/${item.image}`}
              alt={item.title}
              className="w-full h-full object-contain rounded-2xl"
            />
          ) : (
            <Carousel />
          )}
        </div>
        
        <div className="flex flex-col w-[30%] min-h-[70vh] rounded-2xl border bg-white border-gray-300 shadow-2xl mt-16">
          <div className="w-full h-18 flex font-[MuseoModerno] text-xl font-bold items-center border-b-2 border-gray-300 px-5">
            Product Details
          </div>
          <ul className="p-5 space-y-1 font-[MuseoModerno] text-l flex flex-col gap-5">
            <li>
              <strong>Item ID:</strong> {item._id}
            </li>
            <li>
              <strong>Item Name:</strong> {item.title}
            </li>
            <li>
              <strong>Condition:</strong> {item.condition || "New"}
            </li>
            <li>
              <strong>Category:</strong> {item.category || "Uncategorized"}
            </li>
            <li>
              <strong>Description:</strong> {item.description}
            </li>
            <li>
              <strong>Created:</strong> {formatDate(item.createdAt)}
            </li>
          </ul>
        </div>

        <div className="flex flex-col w-[30%] min-h-[70vh] rounded-2xl bg-white font-[MuseoModerno] border border-gray-300 shadow-2xl mt-16">
          <div className="w-full h-18 flex font-[MuseoModerno] text-xl font-bold items-center border-b-2 border-gray-300 px-5">
            Auction Information
          </div>
          <div className="space-y-0.5 p-5 text-l flex flex-col gap-5">
            <p>
              <strong>Status:</strong> {auctionStatus}
            </p>
            <p>
              <strong>Starting Bid:</strong> ${item.startingBid?.toFixed(2)} USD
            </p>
            <p>
              <strong>Current Bid:</strong> ${(item.currentBid || item.startingBid)?.toFixed(2)} USD
            </p>
            <p>
              <strong>No. of Bids:</strong> {item.bids?.length || 0}
            </p>
            <p>
              <strong>Time left:</strong>{" "}
              <span className="text-red-600 font-semibold">
                {calculateTimeLeft(item.endTime)}
              </span>
            </p>
            <p>
              <strong>Current bidder:</strong>{" "}
              <span>{item.currentBidder || "No bids yet"}</span>
            </p>
            <div>
              {isOwner ? (
                // Show start auction button for owner if auction is upcoming
                auctionStatus === "Upcoming" && (
                  <button 
                    onClick={handleStartAuction}
                    className="w-full py-3 font-bold bg-yellow-500 rounded-md hover:bg-yellow-600"
                  >
                    Start Auction
                  </button>
                )
              ) : (
                // Show join auction button for non-owners if auction is active
                auctionStatus === "Active" && (
                  <button 
                    onClick={handleJoinAuction}
                    className="w-full py-3 font-bold bg-green-500 rounded-md hover:bg-green-600"
                  >
                    Join Auction
                  </button>
                )
              )}
              
              {/* Show message if auction has ended */}
              {auctionStatus === "Ended" && (
                <p className="text-center py-3 font-semibold text-red-600">
                  This auction has ended
                </p>
              )}
              
              <p className="text-xs text-gray-600 pt-2">
                All bids are legally binding and all sales are final.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
