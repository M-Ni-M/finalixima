import React from 'react'
import vid from "/images/vid.mp4"; // Import the video file
import { Link } from 'react-router';

const LoginPage = () => {
  return (
    <>
      <section className="h-screen w-full flex flex-col md:flex-row">
        {/* Left Section - Login Form */}
        <div className="flex flex-col justify-center items-center w-full mt-20 md:w-2/3 bg-white p-4 md:p-8 lg:p-16">
          <h1 className="font-[MuseoModerno] text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-center whitespace-nowrap">
            Welcome back
          </h1>
          <form
            action=""
            className="flex flex-col justify-center items-center w-full mt-6 font-[MuseoModerno]"
          >
            <input
              className="w-full max-w-md pl-4 py-3 md:py-4 lg:py-5 bg-white mt-4 rounded-full text-black border border-red-800 text-lg md:text-xl lg:text-2xl outline-none focus:ring-0"
              type="text"
              placeholder="Username"
            />
            <input
              className="w-full max-w-md pl-4 py-3 md:py-4 lg:py-5 bg-white mt-4 rounded-full text-black border border-red-800 text-lg md:text-xl lg:text-2xl outline-none focus:ring-0"
              type="password"
              placeholder="Password"
            />
  <button
              type="submit"
              className="w-full max-w-md px-5 py-3 md:py-4 lg:py-5 bg-red-800 mt-6 rounded-full text-white hover:bg-red-600 text-lg md:text-xl lg:text-2xl font-bold cursor-pointer"
            >
            <Link to='/product' >  Login</Link>
            </button>
          

            <p className="text-lg md:text-xl lg:text-2xl my-5">or login with</p>
            <button
              type="button"
              className="w-full max-w-md px-5 py-3 md:py-4 lg:py-5 bg-blue-800 mt-3 rounded-full text-white hover:bg-blue-600 text-lg md:text-xl lg:text-2xl font-bold cursor-pointer"
            >
              Google
            </button>
            <div className="w-full text-right font-bold mt-3 text-blue-950">
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

export default LoginPage;