import React from "react";
// import img from "./components/bag.png";
// import { Link } from "react-router";
import Nav from "../components/Nav";
import Carousel from "../components/Carousel";

export const ProductDetail = () => {
  return (
    <>
      <Nav />
      <section className="w-full h-screen flex items-center bg-[#F2F2F2] pt-[4vh] gap-5 px-5">
        <div className="w-[40vw] h-[70vh] flex items-center justify-center rounded-2xl bg-blue-800">
          <Carousel />
        </div>

        <div className="flex flex-col w-[30%] min-h-[70vh] rounded-2xl border border-red-800 shadow-2xl">
          <div className="w-full h-18 flex font-[MuseoModerno] text-2xl font-bold items-center border-b-3 border-red-800 px-10">
            Product Details
          </div>
          <ul className="p-10 space-y-1 font-[MuseoModerno] text-xl flex flex-col gap-5">
            <li>
              <strong>Item ID:</strong> 12345{" "}
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
            <li>
              <strong>Brand:</strong> n/a{" "}
            </li>
            <li>
              <strong>Color:</strong> green
            </li>
            <li>
              <strong>Specs:</strong> n/a
            </li>
          </ul>
        </div>

        <div className="flex flex-col w-[30%] min-h-[70vh] rounded-2xl  font-[MuseoModerno] border border-red-800 shadow-2xl ">
          <div className="w-full h-18 flex font-[MuseoModerno] text-2xl font-bold items-center border-b-3 border-red-800 px-5">
            Bid Information
          </div>
          <div className="space-y-2 p-10 text-xl flex flex-col gap-5">
            <p>
              <strong>Bid status:</strong> Open
            </p>
            <p>
              <strong>Eligibility status:</strong>{" "}
              <a href="#" className="text-blue-600">
                Check now
              </a>
            </p>
            <p>
              <strong>Sale status:</strong> Minimum bid
            </p>
            <p>
              <strong>Time left:</strong>{" "}
              <span className="text-red-600 font-semibold">12D 3H 15min</span>{" "}
            </p>
            <p>
              <strong>Current bid:</strong>{" "}
              <span className="text-lg font-bold">$250.00 USD</span>
            </p>
            <p className="text-yellow-600">Seller reserve not yet met</p>

            <div>
              <label className="block font-semibold mb-1">Your bid:</label>
              <input
                type="number"
                className="w-full border p-2 rounded-md mb-2"
                placeholder="$"
              />
              <p className="text-sm text-gray-500">($10.00 Bid increment)</p>
            </div>
            <button className="w-full bg-yellow-500 hover:bg-yellow-600">
              Bid now
            </button>
            <p className="text-xs text-gray-600 pt-2">
              All bids are legally binding and all sales are final.
            </p>
          </div>
        </div>{" "}
      </section>
    </>
  );
};
export default ProductDetail;
