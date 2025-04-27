import React from "react";
import img from "/images/car.png";
import works from "/images/works.png";

import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div className="relative">
      {/* Main Landing Page Section */}
      <section
        className="sticky top-0 min-h-screen w-full bg-cover bg-center bg-no-repeat bg-gray-900 flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundImage: "url('/images/bg.png')" }}
        aria-label="Landing Page Background"
      >
        <div className="flex flex-col w-full min-h-screen">
          {/* Header */}
          <div className="mt-10 flex flex-wrap justify-between items-center px-4 z-30 w-full">
            <h1 className="font-[MuseoModerno] font-bold text-4xl sm:text-5xl md:text-6xl">
              F<span className="text-red-800">.</span>
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-sm sm:text-base md:text-lg font-medium font-[MuseoModerno] text-white">
              <Link to="/login">
                <button className="px-5 py-2 bg-red-800 rounded-full cursor-pointer">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-2 bg-red-800 rounded-full cursor-pointer">
                  Signup
                </button>
              </Link>
            </div>
          </div>

          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-black text-center z-10 px-4">
            <h1 className="text-[22vw] sm:text-[29vw] md:text-[22vw] lg:text-[20vw] font-[Seasons-Regular]">
              finalixima
            </h1>
            <h2 className="mt-5 font-[MuseoModerno] font-bold text-[8vw] sm:text-[6vw] md:text-[5vw]">
              Ready, Set, <span className="text-red-800">Bid</span>!
            </h2>
          </div>

          {/* Image Overlay */}
          <img
            src={img}
            alt="Overlay Image"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] sm:w-[10%] md:w-[40%] lg:w-[30%] h-auto object-contain z-20"
          />
        </div>
      </section>

      {/* Second Section */}
      <section className="font-[MuseoModerno] sticky top-0 min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 bg-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">
          Auction Categories
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          Explore our range of auction items
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
          {/* Category Items */}
          {/* Repeat for each category */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1693398578278-595989b778e3?w=500"
              alt="Agricultural"
              className="w-full h-[40vh] object-cover"
            />
            <div className="bg-red-500 text-white p-3">
              <h3 className="font-semibold">Agricultural Products</h3>
              <p className="text-sm">
                We feature a range of agriculture produce like cocoa, shea nuts,
                and fresh produce for all your needs.
              </p>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1661144050353-1d2566cbdf03?w=500"
              alt="Artisan Crafts"
              className="w-full h-[40vh] object-cover"
            />
            <div className="bg-yellow-500 text-white p-3">
              <h3 className="font-semibold">Artisan Crafts</h3>
              <p className="text-sm">
                Discover unique African crafts you didnt know existed including
                kente cloth, furniture, textiles.
              </p>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1628911771814-5d61388efbf7?w=500"
              alt="Electronics"
              className="w-full h-[40vh] object-cover"
            />
            <div className="bg-green-600 text-white p-3">
              <h3 className="font-semibold">Electronics & Gadgets</h3>
              <p className="text-sm">
                Find refurbished and new electronics and gadgets to meet your
                tech needs and more.
              </p>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1720343354398-89c6aa6d12a4?w=500"
              alt="Fashion"
              className="w-full h-[40vh] object-cover"
            />
            <div className="bg-gray-800 text-white p-3">
              <h3 className="font-semibold">Fashion & Home Decor</h3>
              <p className="text-sm">
                Find local fashion designs, clothes and seasonal home decor
                items for every occasion.
              </p>
            </div>
          </div>
        </div>
        <Link to="/signup">
          <button className="px-7 py-2 bg-red-600 rounded-full cursor-pointer mt-8 font-bold text-white ">
            Signup
          </button>
        </Link>
      </section>

      {/* Third Section */}
      {/* <section className="sticky top-0 min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-white p-6 gap-6">
        <div className="w-full flex justify-center items-center">
            <img
            src={works}
            alt=""
            className="max-w-[75vw] h-auto"
          />
        </div>
        <div className="flex-1 flex justify-center items-center">
       
        </div>
      </section> */}

      {/* Footer Section */}
      <footer className="sticky top-0 min-h-screen w-full flex flex-col items-center justify-center  bg-white text-white p-4">
        <div className="flex flex-col justify-center items-center text-center h-[90vh]">
          <img
            width="400"
            src="https://images.unsplash.com/photo-1665686377065-08ba896d16fd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
          <h1 className="font-[MuseoModerno] text-black text-xl sm:text-2xl md:text-4xl font-bold mt-4">
Experience the excitement of the auction floor <span className="text-green-700">online</span>           </h1>
        </div>
        <div className="mt-8 w-full text-center border-t border-gray-300 pt-4">
          <p className="text-sm text-black sm:text-base">
            © 2025 teamMNM®. All rights reserved.
          </p>
        </div>
      </footer>
      
    </div>
  );
};

export default LandingPage;
