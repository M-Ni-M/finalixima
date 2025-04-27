// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { Link } from "react-router-dom";
import AddItemModal from "../components/AdditemModal";
import AuctionsTable from "../components/AuctionsTable";
import BackButton from "../components/BackButton";
import { apiCreateAuction, apiGetUserAuctions } from "../services/auction";

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchAuctions = async () => {
    setIsLoading(true);
    try {
      const response = await apiGetUserAuctions();
      if (response.data && response.data.items) {
        const formattedItems = response.data.items.map(item => ({
          id: item.id,
          name: item.title,
          image: item.image
            ? `https://res.cloudinary.com/dyfpxokoj/image/upload/${item.image}`
            : "https://via.placeholder.com/60?text=No+Image",
          date: new Date(item.createdAt).toLocaleDateString(),
          status: new Date(item.endTime) > new Date() ? "Active" : "Completed",
          startingBid: item.startingBid,
          currentBid: item.currentBid || item.startingBid,
          category: item.category || "Uncategorized",
          description: item.description,
          endTime: new Date(item.endTime).toLocaleDateString(),
        }));

        setProducts(formattedItems);
        setTotalItems(formattedItems.length);
      } else {
        setProducts([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Error fetching auctions:", err);
      setError("Failed to load auction items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleAddItem = async (formData) => {
    try {
      await apiCreateAuction(formData);
      fetchAuctions();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const filteredProducts = searchTerm
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const activeAuctions = products.filter(item => item.status === "Active").length;
  const completedAuctions = products.filter(item => item.status === "Completed").length;

  return (
    <section className="flex flex-col w-full h-screen">
      {/* Navbar */}
      <div className="flex flex-wrap items-center bg-red-600 w-full fixed p-3 justify-between">
        {/* Logo and Title */}
        <div className="flex items-center w-1/2 sm:w-1/3 md:w-1/4">
          <img src="/images/wb.png" width={40} alt="Logo" className="mr-2" />
          <h1 className="font-[MuseoModerno] font-semibold text-lg sm:text-xl md:text-2xl text-white">
            Dashboard
          </h1>
        </div>

        {/* Dropdown Menu for Navigation */}
        <div className="flex justify-center items-center ">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-white text-red-600 font-[MuseoModerno] font-medium py-2 px-4 rounded-full focus:outline-none"
          >
            Menu
          </button>
          {menuOpen && (
            <div className="absolute top-12 right-0 w-40 bg-white rounded-md shadow-lg z-50">
              <div className="flex flex-col font-[MuseoModerno] text-black">
                <Link
                  to="/product"
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Auctions
                </Link>
                <Link
                  to="/purchases"
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Purchases
                </Link>
                
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full min-h-fit gap-5 p-5 sm:p-10 pt-40 sm:pt-20 justify-center bg-gray-100" style={{ backgroundImage: "url('/images/bg.png')" }}>
        <BackButton />

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
          <div className="flex flex-col w-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
            <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
            <p className="font-[MuseoModerno] font-medium text-sm sm:text-base">
              Total Auctioned Items
            </p>
            <h1 className="font-[MuseoModerno] font-bold text-xl sm:text-2xl">
              {totalItems}
            </h1>
          </div>
          <div className="flex flex-col w-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
            <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
            <p className="font-[MuseoModerno] font-medium text-sm sm:text-base">
              Active Auctions
            </p>
            <h1 className="font-[MuseoModerno] font-bold text-xl sm:text-2xl">
              {activeAuctions}
            </h1>
          </div>
          <div className="flex flex-col w-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
            <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
            <p className="font-[MuseoModerno] font-medium text-sm sm:text-base">
              Completed Auctions
            </p>
            <h1 className="font-[MuseoModerno] font-bold text-xl sm:text-2xl">
              {completedAuctions}
            </h1>
          </div>
        </div>

        {/* Search and Add Item Button */}
        <div className="flex flex-col sm:flex-row justify-between gap-5 mt-5">
          <div className="flex items-center gap-5 w-full sm:w-2/3">
            <button className="rounded-md bg-white border border-gray-300 p-2 flex items-center justify-center">
              <CiFilter />
            </button>
            <input
              className="bg-white rounded-md border border-gray-300 p-2 w-full sm:w-2/4 pl-4 font-medium"
              placeholder="Search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="p-2 px-6 bg-red-600 rounded-md font-[MuseoModerno] font-medium text-sm sm:text-base text-white cursor-pointer"
          >
            Add Item
          </button>
        </div>

        {/* Auction Table */}
        {isLoading ? (
          <div className="text-center py-10">
            <p className="font-[MuseoModerno] text-lg">Loading auction items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="font-[MuseoModerno] text-lg text-red-600">{error}</p>
            <button
              onClick={fetchAuctions}
              className="mt-4 p-2 bg-red-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <AuctionsTable products={filteredProducts} onRefresh={fetchAuctions} />
        )}

        {/* Add Item Modal */}
        {showModal && (
          <AddItemModal
            onClose={() => setShowModal(false)}
            onSubmit={handleAddItem}
          />
        )}
      </div>
    </section>
  );
};

export default DashboardPage;
