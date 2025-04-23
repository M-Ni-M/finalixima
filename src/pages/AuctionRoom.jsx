import React, { useState, useEffect } from "react";
import BackButton from "../components/BackButton";

const AuctionRoom = ({ duration = 2147 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [currentBid, setCurrentBid] = useState(10000000); // Starting bid in cedis
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}m : ${String(seconds % 60).padStart(2, "0")}s`;
  const formatCurrency = (amount) => `₵${(amount / 1000000).toFixed(2)}M`;

  const addBid = (amount) => {
    if (amount > currentBid) {
      setCurrentBid(amount);
      setBids([{ name: "You", bid: amount }, ...bids]);
    }
  };

  const handleBid = () => {
    const amount = parseInt(bidAmount);
    if (!isNaN(amount)) addBid(amount);
    setBidAmount("");
  };

  const handleQuickBid = () => addBid(currentBid + 1000000);

  const topBid = bids.length > 0 ? bids[0] : null;

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
          <div className="w-full lg:w-1/2 h-auto min-h-[50vh] sm:h-[70vh] bg-white flex flex-col items-center rounded-xl border border-gray-300 shadow overflow-hidden">
            <div className="w-full h-48 sm:h-2/3 bg-blue-500 rounded-t-xl"></div>
            <div className="p-4 w-full text-center">
              <h2 className="text-lg sm:text-xl font-semibold">Farmhouse 1</h2>
              <p className="text-red-500 text-sm sm:text-base">
                Bidding Ends - {formatTime(timeLeft)}
              </p>
              <p className="text-base sm:text-lg font-bold mt-2">
                Start Bid: ₵10 Million
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Auction ID: 3450987
              </p>
              <p className="text-xs sm:text-sm text-black">
                Location: Ghana, Accra
              </p>
            </div>
          </div>

          {/* Bidding Section */}
          <div className="w-full lg:w-1/2 h-auto min-h-[50vh] sm:h-[70vh] bg-white border border-gray-300 rounded-xl shadow p-3 sm:p-4 flex flex-col">
            <div className="mb-3 sm:mb-4">
              <p className="text-red-500 font-bold uppercase text-sm sm:text-base">
                Auction Information
              </p>
              <h1 className="text-xl sm:text-2xl font-bold mt-1">
                My Current Bid : {formatCurrency(currentBid)}
              </h1>
            </div>

            <div className="bg-gray-100 flex-1 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 overflow-y-auto">
              <h2 className="font-semibold mb-2 text-sm sm:text-base">Top Bid</h2>
              {topBid ? (
                <div className="flex justify-between p-2 sm:p-3 bg-white rounded-lg shadow">
                  <p className="font-medium text-sm sm:text-base">{topBid.name}</p>
                  <p className="font-semibold text-sm sm:text-base">
                    {formatCurrency(topBid.bid)}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm sm:text-base">No bids yet</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="number"
                placeholder="Enter your bid (cedis)"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-2 sm:gap-3">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base flex-1"
                  onClick={handleBid}
                >
                  PLACE BID
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base whitespace-nowrap"
                  onClick={handleQuickBid}
                >
                  +₵1M
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;