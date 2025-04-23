import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Nav from "../components/Nav";
import { apiGetAllAuctions } from "../services/auction";

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
        setItems(response.data.items);
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
      <section className="w-full h-full flex flex-col items-center bg-[#F2F2F2] pt-20">
        <div className="w-full px-10 flex items-start ">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="font-[MuseoModerno] font-bold text-2xl text-black hover:text-gray-600 cursor-pointer"
          >
            ← Go Back
          </button>
        </div>
      
        <div className="flex items-center justify-evenly w-full max-w-sm h-[7vh] rounded-full my-5 text-black bg-white text-l font-medium font-[MuseoModerno]">
          <p 
            className={`flex items-center justify-center cursor-pointer ${selectedCategory === "All" ? "text-red-600" : "hover:text-red-600"}`}
            onClick={() => handleCategoryChange("All")}
          >
            All
          </p>
          <p 
            className={`cursor-pointer ${selectedCategory === "Live" ? "text-red-600" : "hover:text-red-600"}`}
            onClick={() => handleCategoryChange("Live")}
          >
            Live
          </p>
          <p 
            className={`cursor-pointer ${selectedCategory === "Lifestyle" ? "text-red-600" : "hover:text-red-600"}`}
            onClick={() => handleCategoryChange("Lifestyle")}
          >
            Lifestyle
          </p>
          <p 
            className={`cursor-pointer ${selectedCategory === "Technology" ? "text-red-600" : "hover:text-red-600"}`}
            onClick={() => handleCategoryChange("Technology")}
          >
            Technology
          </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center w-[80vw] min-h-screen py-8">
            {filteredItems.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default ProductPage;

