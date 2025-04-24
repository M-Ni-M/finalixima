import React from "react";
import { Link } from "react-router-dom";


export const ProductCard = ({ item }) => {
  console.log("ProductCard item:", item);
  
  // Debug: Log the specific ID that will be used in the link
  console.log("Item ID being used for link:", item.id);
  return (
    <Link to={`/detail/${item.id}`} className="block w-full max-w-sm mx-auto my-4">
      <div className="font-[MuseoModerno] bg-green-600 rounded-lg overflow-hidden shadow-md h-80 md:h-96 cursor-pointer hover:shadow-xl transition-shadow">
        <div className="w-full h-4/5 flex items-center justify-center">
          <img 
            className="w-full h-full object-cover"
            src={item.image ? `https://res.cloudinary.com/dyfpxokoj/image/upload/${item.image}` : "https://via.placeholder.com/300?text=No+Image"}
            alt={item.title}
          />
        </div>
        <div className="w-full h-1/5 text-black flex items-center px-4 justify-between font-Archivo text-l">
          <div>
            <h1 className="font-bold">{item.title}</h1>
            <p className="text-sm">{item.category || "Uncategorized"}</p>
          </div>
          <div className="bg-red-800 text-white flex items-center justify-center font-medium rounded-xl p-2">
            ${item.startingBid}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;