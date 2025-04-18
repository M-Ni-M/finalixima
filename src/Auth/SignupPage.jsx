import React from "react";
import vid from "/images/vid.mp4"; // Import the video file

const SignupPage = () => {
  return (
    <>
      <section className="h-screen w-full flex flex-col md:flex-row">
        {/* Left Section - Login Form */}
        <div className="flex flex-col justify-center items-center w-full mt-10 md:w-2/3 bg-white p-4 md:p-6 lg:p-8">
          <h1 className="font-[MuseoModerno] text-3xl sm:text-4xl md:text-3xl lg:text-6xl font-bold text-center whitespace-nowrap">
            Signup to start bidding
          </h1>
          <form
            action=""
            className="flex flex-col justify-center items-center w-full mt-4 font-[MuseoModerno]"
          >
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="text"
              placeholder="Username"
            />
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="email"
              placeholder="Email"
            />
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="password"
              placeholder="Password"
            />
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="password"
              placeholder="Confirm Password"
            />
            <button
              type="submit"
              className="w-full max-w-sm px-4 py-2 md:py-3 lg:py-4 bg-red-800 mt-4 rounded-full text-white hover:bg-red-600 text-base md:text-lg lg:text-xl font-bold cursor-pointer"
            >
              signup
            </button>
            <p className="text-base md:text-lg lg:text-xl my-2">
              or signup with
            </p>
            <button
              type="button"
              className="w-full max-w-sm px-4 py-2 md:py-3 lg:py-4 bg-blue-800 mt-2 rounded-full text-white hover:bg-blue-600 text-base md:text-lg lg:text-xl font-bold cursor-pointer"
            >
              Google
            </button>
            <div className="w-full text-right font-bold mt-2 text-blue-950">
              <p className="cursor-pointer">forgot password</p>
            </div>
          </form>
        </div>

        {/* Right Section - Video Background */}
        <div className="w-full md:w-1/3 h-64 md:h-auto">
          <video
            src={vid}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          ></video>
        </div>
      </section>
    </>
  );
};

export default SignupPage;