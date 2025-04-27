import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Nav from "../components/Nav";
import { apiGetAllAuctions } from "../services/auction";
import BackButton from "../components/BackButton";

const ProductPage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Function to fetch all auction items
  const fetchAllItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching all auction items...");
      const response = await apiGetAllAuctions();
      console.log("API response received:", response);
      
      if (response.data && response.data.items) {
        // Convert prices from dollars to cedis if needed (assuming 1 USD = ~12 GHS)
        const itemsWithCediPrices = response.data.items.map(item => ({
          ...item,
          currentPrice: item.currentPrice * 12, // Conversion rate example
          priceSymbol: '₵' // Add Ghanaian cedi symbol
        }));
        setItems(itemsWithCediPrices);
      } else {
        console.log("No items found in response");
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching auction items:", err);
      
      if (err.code === 'ECONNABORTED') {
        setError("Request timed out. The server is taking too long to respond.");
      } else if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Something went wrong'}`);
      } else if (err.request) {
        setError("No response received from server. Please check your connection.");
      } else {
        setError("An error occurred while fetching auction items.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch items when component mounts
  useEffect(() => {
    fetchAllItems();
  }, []);

  // Filter items based on selected category
  const filteredItems = selectedCategory === "All" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  // Function to handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Nav />
      <section 
        className="w-full min-h-[80vh] flex flex-col items-center bg-[#F2F2F2] pb-10 px-4 sm:px-6"
        style={{ backgroundImage: "url('/images/bg.png')" }}
      >
        
        {/* Category Selector - Responsive */}
        <div className="w-fit mt-15 sm:mt-5">
          <div className="flex flex-wrap items-center justify-center gap-2 w-full h-auto min-h-[5vh] rounded-full p-2 text-black bg-white text-xs sm:text-sm mt-25  md:text-base font-medium font-[MuseoModerno] border border-gray-300 shadow-md overflow-x-auto">
            <p 
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full cursor-pointer transition-colors ${selectedCategory === "All" ? "text-red-600 font-bold" : "hover:text-red-600"}`}
              onClick={() => handleCategoryChange("All")}
            >
              All
            </p>
            <p 
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full cursor-pointer transition-colors ${selectedCategory === "Agricultural products" ? "text-red-600 font-bold" : "hover:text-red-600"}`}
              onClick={() => handleCategoryChange("Agricultural products")}
            >
              Agricultural
            </p>
            <p 
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full cursor-pointer transition-colors ${selectedCategory === "Artisan crafts" ? "text-red-600 font-bold" : "hover:text-red-600"}`}
              onClick={() => handleCategoryChange("Artisan crafts")}
            >
              Artisan crafts
            </p>
            <p 
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full cursor-pointer transition-colors ${selectedCategory === "Electronics & Gadgets" ? "text-red-600 font-bold" : "hover:text-red-600"}`}
              onClick={() => handleCategoryChange("Electronics & Gadgets")}
            >
              Electronics
            </p>
            <p 
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full cursor-pointer transition-colors ${selectedCategory === "Fashion & Home decor" ? "text-red-600 font-bold" : "hover:text-red-600"}`}
              onClick={() => handleCategoryChange("Fashion & Home decor")}
            >
              Fashion & Decor
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="font-[MuseoModerno] text-xl">Loading auction items...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center min-h-[50vh]">
            <p className="font-[MuseoModerno] text-xl text-red-600">{error}</p>
            <button 
              onClick={fetchAllItems}
              className="mt-5 p-3 bg-red-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="font-[MuseoModerno] text-xl">No auction items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-center w-full max-w-6xl py-5">
            {filteredItems.map((item) => (
              <ProductCard 
                key={item.id} 
                item={{
                  ...item,
                  // Ensure the price is displayed with Ghanaian cedi symbol
                  priceSymbol: '₵',
                  // Format price to Ghanaian standards if needed
                  formattedPrice: `₵${item.currentPrice.toLocaleString('en-GH')}`
                }} 
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default ProductPage;