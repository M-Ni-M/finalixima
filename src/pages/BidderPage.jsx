import React from "react";
import Nav from "../components/Nav";
import Carousel from "../components/Carousel";
import { Link } from "react-router";

export const BidderPage = () => {
  return (
    <>
      <Nav />
    
      <section className="w-full h-screen  flex-col items-center bg-[#F2F2F2] pt-[4vh] gap-5 px-5">
      <BackButton/>
      <div className="flex pt-[4vh] gap-5 px-5">
          {" "}
          {/* Left Section: Product Image Carousel */}
          <div className="w-[40vw] h-[70vh] flex items-center justify-center rounded-2xl bg-gray-600">
            <Carousel />
          </div>
          {/* Middle Section: Product Details */}
          <div className="flex flex-col w-[30%] min-h-[70vh] rounded-2xl  bg-white border border-gray-300 shadow-2xl">
            <div className="w-full h-18 flex font-[MuseoModerno] text-xl font-bold items-center border-b-2 border-gray-300 px-5">
              Product Details
            </div>
            <ul className="p-5 space-y-1 font-[MuseoModerno] text-l flex flex-col gap-5">
              <li>
                <strong>Item ID:</strong> 12345{" "}
              </li>
              <li>
                <strong>Item Name:</strong> Kombacha{" "}
              </li>
              <li>
                <strong>Condition:</strong> New{" "}
              </li>
              <li>
                <strong>Category:</strong> Furniture{" "}
              </li>
              <li>
                <strong>Description:</strong> Lorem ipsum dolor sit amet,
                consectetur adipisicing elit. Tempore id, explicabo ab obcaecati
                architecto quod ea{" "}
              </li>
            </ul>
          </div>
          {/* Right Section: Auction Information and Bid Input */}
          <div className="flex flex-col w-[30%] min-h-[70vh] rounded-2xl bg-white font-[MuseoModerno] border border-gray-300 shadow-2xl">
            <div className="w-full h-18 flex font-[MuseoModerno] text-xl font-bold items-center border-b-2 border-gray-300 px-5">
              Auction Information
            </div>
            <div className="space-y-0.5 p-5 text-l flex flex-col gap-5">
              <p>
                <strong>Status:</strong> Active
              </p>
              <p>
                <strong>No. of Bids:</strong> 5
              </p>
              <p>
                <strong>Time left:</strong>{" "}
                <span className="text-red-600 font-semibold">12D 3H 15min</span>
              </p>
              <p>
                <strong>Current price:</strong> <span>$250.00 USD</span>
              </p>
              <p>
                <strong>Current bidder:</strong> <span>McKay</span>
              </p>
              <div>
              
              <Link to='/room' >  <button className="w-full py-3 mt-3 font-bold bg-yellow-500 rounded-md hover:bg-yellow-600 cursor-pointer">
              Enter Auction Room                </button></Link>
                <p className="text-xs text-gray-600 pt-2">
                  All bids are legally binding and all sales are final.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BidderPage;
