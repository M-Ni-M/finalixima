import React from "react";
import { Link } from "react-router";

export const ProductCard = ({ item }) => {
  return (
    <Link to={`/detail/${item._id}`} className="block w-full max-w-sm mx-auto my-4">
      <div className="font-[MuseoModerno] border border-gray-300 bg-white rounded-lg overflow-hidden shadow-md h-[50vh] sm:h-80 md:h-96 lg:h-[50vh]">
        <div className="w-full h-4/5 flex items-center justify-center ">
          <img 
            className="w-full h-full object-cover"
            src={item.image ? `https://res.cloudinary.com/dyfpxokoj/image/upload/${item.image}` : "https://via.placeholder.com/300?text=No+Image"}
            alt={item.title}
          />
        </div>
        <div className="w-full h-1/5 text-black flex items-center px-4 justify-between font-Archivo text-l">
          <div>
            <h1 className="font-bold">{item.title}</h1>
            {/* <p>{item.category || "Uncategorized"}</p> */}
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