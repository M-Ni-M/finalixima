import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Carousel from "../components/Carousel";
import { useNavigate, useParams } from "react-router";
import { apiGetAuctionById } from "../services/auction";
import io from "socket.io-client";

export const ProductDetail = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [socket, setSocket] = useState(null);
  const [startingAuction, setStartingAuction] = useState(false);

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
        if (response.data) {
          setItem(response.data);
          const userId = localStorage.getItem("userId");
          setIsOwner(userId === response.data.sellerId);
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

    fetchItemDetails();
  }, [id]);

  useEffect(() => {
    const auctionSocket = io("http://localhost:3333/auction");
    setSocket(auctionSocket);

    auctionSocket.on("auctionStarted", (auctionData) => {
      if (auctionData.auctionId === id) {
        setItem(prev => ({
          ...prev,
          status: "active",
          isActive: true
        }));
      }
    });

    return () => {
      auctionSocket.disconnect();
    };
  }, [id]);

  const handleStartAuction = async () => {
    try {
      setStartingAuction(true);
      if (socket) {
        socket.emit("startAuction", {
          auctionId: id,
          title: item.title
        });
      }
      setItem(prev => ({
        ...prev,
        status: "active",
        isActive: true
      }));
      navigate(`/room/${id}`);
    } catch (error) {
      console.error("Error starting auction:", error);
      alert("Failed to start auction. Please try again.");
    } finally {
      setStartingAuction(false);
    }
  };

  const handleJoinAuction = () => {
    navigate(`/room/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

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
        <section className="w-full min-h-screen flex items-center justify-center bg-[#F2F2F2] pt-[4vh]">
          <p className="font-[MuseoModerno] text-xl">Loading item details...</p>
        </section>
      </>
    );
  }

  if (error || !item) {
    return (
      <>
        <Nav />
        <section className="w-full min-h-screen flex flex-col items-center justify-center bg-[#F2F2F2] pt-[4vh]">
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

  return (
    <>
      <Nav />
      
      <section
        className="w-full min-h-screen flex items-center justify-center bg-[#F2F2F2] pt-[4vh] pb-10"
        style={{ backgroundImage: "url('/images/bg.png')" }}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-36 md:mt-15">
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Product Image */}
            <div className="w-full lg:w-[40%] flex items-center justify-center rounded-2xl bg-white border border-gray-300 shadow-2xl overflow-hidden">
              {item.image ? (
                <img
                  src={`https://res.cloudinary.com/dyfpxokoj/image/upload/${item.image}`}
                  alt={item.title}
                  className="max-w-full max-h-full object-contain rounded-2xl"
                />
              ) : (
                <Carousel />
              )}
            </div>

            {/* Product Details */}
            <div className="w-full lg:w-[40%] rounded-2xl border bg-white border-gray-300 shadow-2xl">
              <div className="w-full h-16 md:h-18 flex font-[MuseoModerno] text-lg md:text-xl font-bold items-center border-b-2 border-gray-300 px-5">
                Product Details
              </div>
              <ul className="p-4 md:p-5 space-y-1 font-[MuseoModerno] text-sm md:text-base flex flex-col gap-3 md:gap-5">
                <li><strong>Item ID:</strong> {item._id || item.id}</li>
                <li><strong>Item Name:</strong> {item.title}</li>
                <li><strong>Condition:</strong> {item.condition || "New"}</li>
                <li><strong>Category:</strong> {item.category || "Uncategorized"}</li>
                <li><strong>Description:</strong> {item.description}</li>
                <li><strong>Created:</strong> {formatDate(item.createdAt)}</li>
              </ul>
            </div>

            {/* Auction Information */}
            <div className="w-full lg:w-[30%] rounded-2xl bg-white font-[MuseoModerno] border border-gray-300 shadow-2xl">
              <div className="w-full h-16 md:h-18 flex font-[MuseoModerno] text-lg md:text-xl font-bold items-center border-b-2 border-gray-300 px-5">
                Auction Information
              </div>
              <div className="space-y-0.5 p-4 md:p-5 text-sm md:text-base flex flex-col gap-3 md:gap-5">
                <p><strong>Status:</strong>{" "}
                  <span className={item.status === "active" ? "text-green-600 font-semibold" : ""}>
                    {item.status}
                  </span>
                </p>
                <p><strong>Starting Bid:</strong> ${item.startingBid?.toFixed(2)} USD</p>
                <p><strong>Current Bid:</strong> ${(item.currentBid || item.startingBid)?.toFixed(2)} USD</p>
                <p><strong>No. of Bids:</strong> {item.bids?.length || 0}</p>
                <p><strong>Time left:</strong>{" "}
                  <span className="text-red-600 font-semibold">
                    {calculateTimeLeft(item.endTime)}
                  </span>
                </p>
                <p><strong>Current bidder:</strong> {item.currentBidder || "No bids yet"}</p>

                <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
                  {!isOwner && item.status === "active" && (
                    <button
                      onClick={handleJoinAuction}
                      className="w-full py-2 md:py-3 font-bold bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Join Auction
                    </button>
                  )}

                  {item.status === "active" && (
                    <div className="bg-green-100 border border-green-400 p-3 md:p-4 rounded-md">
                      <p className="text-green-700">
                        Time remaining: {calculateTimeLeft(item.endTime)}
                      </p>
                    </div>
                  )}

                  {isOwner && item.status === "upcoming" && (
                    <div className="bg-blue-100 border border-blue-400 p-3 md:p-4 rounded-md">
                      <p className="text-blue-800 font-bold">You are the owner</p>
                      <p className="text-blue-700 mb-2">
                        Start the auction to allow bidders to participate.
                      </p>
                      <button
                        onClick={handleStartAuction}
                        disabled={startingAuction}
                        className={`w-full py-2 ${
                          startingAuction
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white font-bold rounded-md`}
                      >
                        {startingAuction ? "Starting..." : "Start Auction"}
                      </button>
                    </div>
                  )}

                  {item.status === "closed" && (
                    <p className="text-center py-2 md:py-3 font-semibold text-red-600">
                      This auction has ended
                    </p>
                  )}

                  <p className="text-xs text-gray-600 pt-1 md:pt-2">
                    All bids are legally binding and all sales are final.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
