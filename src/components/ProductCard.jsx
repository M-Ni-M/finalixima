import React from "react";
import { Link } from "react-router";

export const ProductCard = () => {
  return (
    <Link to="/bidder" className="block w-full max-w-sm mx-auto my-4">
      <div className="font-[MuseoModerno]  bg-green-600 rounded-lg overflow-hidden shadow-md h-[50vh] sm:h-80 md:h-96 lg:h-[50vh]">
        <div className="w-full h-4/5 flex items-center justify-center">
          <img src='' alt="" className="object-contain w-full h-full" />
          {/* <img
            className="w-full h-full object-contain"
            src={`https://savefiles.org/${ads.image}/?shareable_link=644`}
            alt={ads.title}/> */}
        </div>
        <div className="w-full h-1/5 text-black flex items-center px-4 justify-between font-Archivo text-l">
          {/* {ads.title} */}
          <div>
            <h1 className="font-bold">Le Chiquito Long</h1>
            <p>Jacquemus</p>
          </div>
          <div className="bg-[#EB4E27] text-white flex items-center justify-center font-medium rounded-xl p-2">
            $600
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;