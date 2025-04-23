import React from "react";
import img from "/images/car.png"; // Import the overlay image
import { Link } from "react-router"; // Use the original react-router Link
import happy from "/images/happy.png"; // Import the happy image

const LandingPage = () => {
  return (
    <div className="relative">
      {/* Main Landing Page Section */}
      <section
        className="sticky top-0 h-screen w-full bg-cover bg-center bg-no-repeat bg-gray-900 flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundImage: "url('/images/bg.png')" }}
        aria-label="Landing Page Background"
      >
        <div className="flex w-full h-screen">
          {/* Header */}
          <div className="mt-10 flex w-full h-16 justify-between items-center px-4 relative z-30">
            <h1 className="font-[MuseoModerno] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl ml-9 sm:ml-6 md:ml-8 lg:ml-10 xl:ml-5">
              F<span className="text-red-800">.</span>
            </h1>
            <div className="flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10 xl:space-x-5 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl font-medium font-[MuseoModerno] text-white">
              <Link to="/login">
                <button className="w-24 sm:w-32 md:w-28 lg:w-36 xl:w-35 h-10 sm:h-12 md:h-11 lg:h-14 xl:h-13 bg-red-800 rounded-full cursor-pointer">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="w-24 sm:w-32 md:w-28 lg:w-36 xl:w-35 h-10 sm:h-12 md:h-11 lg:h-14 xl:h-13 bg-red-800 rounded-full cursor-pointer">
                  Signup
                </button>
              </Link>
            </div>
          </div>

          {/* Text Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-center z-10">
            <h1 className="text-[22vw] sm:text-[19vw] md:text-[15vw] lg:text-[23vw] xl:text-[19vw] font-[Seasons-Regular]">
              finalixima
            </h1>
            <h2 className="mt-8 font-[MuseoModerno] font-bold text-[8vw] sm:text-[6vw] md:text-[6vw] lg:text-[5vw] xl:text-[4vw]">
              Ready, Set, <span className="text-red-800">Bid</span>!
            </h2>
          </div>

          {/* Image Overlay */}
          <img
            src={img}
            alt="Overlay Image"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/7 w-1/2 sm:w-1/5 md:w-5/12 lg:w-6/12 xl:w-4/12 h-auto object-contain z-20"
          />
        </div>
      </section>

      {/* Second Section */}
      <section className="sticky top-0 h-screen w-full flex flex-col items-center justify-center p-9 md:p-8 lg:p-16 bg-white">
        <div className="flex flex-col items-center w-full mt-20 md:w-6/6 bg-white p-9 md:p-8 lg:p-16">
          <h1 className="font-[MuseoModerno] text-2xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-center mb-4">
            Experience the excitement of the auction floor,{" "}
            <span className="text-green-900">online.</span>
          </h1>
          <img src={happy} width="600" alt="Happy" />
          <h1 className="font-[MuseoModerno] text-2xl sm:text-4xl md:text-3xl lg:text-4xl font-bold text-center mb-4">
            Join the auctions <span className="text-green-900">now</span>
          </h1>
          <Link to="/signup">
            <button className="font-[MuseoModerno] font-bold text-white text-l w-28 sm:w-32 md:w-28 lg:w-36 xl:w-35 h-10 sm:h-12 md:h-11 lg:h-14 xl:h-13 bg-green-800 rounded-full cursor-pointer">
              Signup
            </button>
          </Link>
        </div>
      </section>

      {/* Third Section */}
      <section className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gray-100 p-4">
        <div className="flex-1 text-center md:text-left p-4">
          <h1 className="text-5xl font-bold text-black font-mono mb-5">
            Digital Showroom for Vendors & Retailers
          </h1>
          <p className="text-2xl sm:text-3xl md:text-xl font-mono leading-11 text-black">
            Welcome to our Ad Media Library, the ultimate platform for vendors,
            brands, and retailers to showcase their products. Our showroom
            provides a centralized space where you can upload high-quality
            product images and detailed specifications to attract customers and
            business partners.
          </p>
          <Link to="/signup">
            <button className="bg-[#7D9595] w-[10vw] h-[9vh] text-2xl font-bold font-mono cursor-pointer mt-5">
              Sign Up
            </button>
          </Link>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            src="https://framerusercontent.com/images/dJvdzAxodMG2Uz94f6biE2WM.png"
            width="500"
            alt=""
          />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-black text-white p-4">
        <div className="flex flex-col justify-center items-center">
          <img
            width="400"
            src="https://framerusercontent.com/images/QJbv2VFheaAQZxkNAxg0yejpmZk.png"
            alt=""
          />
          <h1 className="text-4xl font-bold font-mono mt-4">
            Only the best of everything you need
          </h1>
        </div>
        <div className="w-full h-[20vh] bg-black text-white flex items-center justify-center">
          <h1 className="text-xl">
            © 2025 teamBots®. All rights reserved.
          </h1>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;