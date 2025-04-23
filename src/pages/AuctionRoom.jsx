import React, { useState, useEffect } from 'react';

const AuctionRoom = ({ duration = 2147 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [currentBid, setCurrentBid] = useState(10000000); // Starting bid in cedis
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}m : ${String(seconds % 60).padStart(2, '0')}s`;
  const formatCurrency = (amount) => `₵${(amount / 1000000).toFixed(2)}M`;

  const addBid = (amount) => {
    if (amount > currentBid) {
      setCurrentBid(amount);
      setBids([{ name: 'You', bid: amount }, ...bids]);
    }
  };

  const handleBid = () => {
    const amount = parseInt(bidAmount);
    if (!isNaN(amount)) addBid(amount);
    setBidAmount('');
  };

  const handleQuickBid = () => addBid(currentBid + 1000000);

  const topBid = bids.length > 0 ? bids[0] : null;

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6 bg-gray-100 min-h-screen">
      {/* Property Info */}
      <div className="w-full md:w-1/3 bg-white rounded-xl shadow p-4">
        <img src="/farmhouse.jpg" alt="Farmhouse 1" className="rounded-xl mb-4" />
        <h2 className="text-xl font-semibold">Farmhouse 1</h2>
        <p className="text-gray-500">Bidding Ends - {formatTime(timeLeft)}</p>
        <p className="text-lg font-bold mt-2">₵10 Million</p>
        <p className="text-sm text-gray-400 mt-1">Auction ID: 3450987</p>
        <p className="text-sm text-gray-400">Location: Delhi, India</p>
      </div>

      {/* Bidding Section */}
      <div className="w-full md:w-2/3 bg-white rounded-xl shadow p-4">
        <div className="mb-4">
          <p className="text-red-500 font-bold uppercase">Price - ₵10 Million</p>
          <h1 className="text-2xl font-bold mt-1">My Current Bid : {formatCurrency(currentBid)}</h1>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <h2 className="font-semibold mb-2">Top Bid</h2>
          {topBid ? (
            <div className="flex justify-between p-3 bg-white rounded-lg shadow">
              <p className="font-medium">{topBid.name}</p>
              <p className="font-semibold">{formatCurrency(topBid.bid)}</p>
            </div>
          ) : (
            <p className="text-gray-500">No bids yet</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="number"
            placeholder="Enter your bid (cedis)"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            onClick={handleBid}
          >
            PLACE YOUR BID
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={handleQuickBid}
          >
            QUICK BID +₵1M
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;
