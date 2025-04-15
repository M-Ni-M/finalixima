import React from "react";
import img from "/images/car.png"; // Import the overlay image
import { Link } from "react-router"; // Use the original react-router Link

const LandingPage = () => {
  return (
    <>
      {/* Main Landing Page Section */}
      <section
        className="relative w-full h-screen bg-cover bg-center bg-no-repeat bg-gray-900 flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundImage: "url('/images/bg.png')" }} // Background image for the landing page
        aria-label="Landing Page Background"
      >
        <div className="flex w-full h-screen">
          <div className="mt-10 flex w-full h-16 justify-between items-center relative z-30 px-4">
            <div className="flex items-center font-[MuseoModerno] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl ml-9 sm:ml-6 md:ml-8 lg:ml-10 xl:ml-12">
              F<span className="text-red-800">.</span>
            </div>
            <div className="flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10 xl:space-x-12 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium font-[MuseoModerno] text-white">
              <Link to="/login">
                <button className="cursor-pointer w-24 sm:w-32 md:w-28 lg:w-36 xl:w-40 h-10 sm:h-12 md:h-11 lg:h-14 xl:h-16 bg-red-800 mr-2 sm:mr-2 md:mr-2 lg:mr-2 xl:mr-2 rounded-full z-30">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="cursor-pointer w-24 sm:w-32 md:w-28 lg:w-36 xl:w-40 h-10 sm:h-12 md:h-11 lg:h-14 xl:h-16 bg-red-800 rounded-full z-30">
                  Signup
                </button>
              </Link>
            </div>
          </div>
          {/* Text Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-black text-center">
            {/* Main Heading */}
            <h1 className="text-[22vw] sm:text-[19vw] md:text-[15vw] lg:text-[13vw] xl:text-[19vw] font-[Seasons-Regular] z-20">
              finalixima
            </h1>
            {/* Subheading */}
            <h2 className="mt-8 font-bold text-[8vw] sm:text-[6vw] md:text-[5vw] lg:text-[3vw] xl:text-[4vw] font-[MuseoModerno] z-20">
              Ready, Set, <span className="text-red-800">Bid</span>!
            </h2>
          </div>

          {/* Image Overlay */}
          <img
            src={img} // Overlay image source
            alt="Overlay Image"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/7 w-1/2 sm:w-1/5 md:w-5/12 lg:w-6/12 xl:w-4/12 h-auto max-w-full object-contain z-20"
          />
        </div>
      </section>
    </>
  );
};

export default LandingPage;
