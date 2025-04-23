import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const INITIAL_TIME = 2147;
const INITIAL_BID = 15000000;

const AuctionRoom = () => {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [currentBid, setCurrentBid] = useState(INITIAL_BID);
  const [bids, setBids] = useState([
    { name: 'Richa Mansookh', bid: 17000000, trend: 'up', change: 70 },
    { name: 'Aarush Patel', bid: 14000000, trend: 'down', change: -10 },
    { name: "Austen D’Souza", bid: 13000000, trend: 'down', change: -20 },
  ]);
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = secs => `${Math.floor(secs/60)}m : ${(secs%60).toString().padStart(2, '0')}s`;
  const formatCurrency = amt => `₵${(amt/1e6).toFixed(2)}M`;

  const addBid = bid => {
    setCurrentBid(bid);
    setBids(bs => [
      { name: 'You', bid, trend: 'up', change: ((bid - currentBid)/currentBid*100).toFixed(1) },
      ...bs
    ].sort((a,b) => b.bid - a.bid));
    setBidAmount('');
  };

  const handleBid = () => {
    const bid = parseInt(bidAmount);
    if (bid > currentBid) addBid(bid);
  };

  const handleQuickBid = () => addBid(currentBid + 1000000);

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6" >
      <section className="w-full h-[50vh] md:w-1/2 bg-white rounded-xl shadow p-4">
        <img src="/farmhouse.jpg" alt="Property" className="rounded-xl mb-4" />
        <h2 className="text-xl font-semibold">Farmhouse 1</h2>
        <p className="text-gray-500">Ends - {formatTime(timeLeft)}</p>
        <p className="text-lg font-bold mt-2">₵10M</p>
        <p className="text-sm text-gray-400">ID: 3450987 | Delhi, India</p>
      </section>

      <section className="w-full md:w-1/2 bg-white rounded-xl shadow p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Current Bid: {formatCurrency(currentBid)}</h1>
        </div>
        <div className="bg-gray-100 rounded-xl p-4 mb-4 max-h-60 overflow-y-auto">
          {bids.map((b, i) => (
            <div key={i} className="flex justify-between p-2 bg-white rounded-lg shadow mb-2">
              <span>{b.name}</span>
              <div className="flex items-center gap-2">
                {b.trend === 'up' ? <FaArrowUp size={16}/> : <FaArrowDown size={16}/>} 
                <span className={b.trend==='up'?'text-green-600':'text-red-600'}>{b.change}%</span>
                <span className="font-semibold">{formatCurrency(b.bid)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <input
            type="number"
            value={bidAmount}
            onChange={e=>setBidAmount(e.target.value)}
            placeholder="Your bid (₵)"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
          />
          <button onClick={handleBid} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">Place Bid</button>
          <button onClick={handleQuickBid} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">+₵1M</button>
        </div>
      </section>
    </div>
  );
};

export default AuctionRoom;
