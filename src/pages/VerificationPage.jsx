import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router";
import { apiVerifyEmail } from "../services/auth"; // Ensure correct path
import vid from "/images/vid.mp4"; // Import the video file

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiVerifyEmail({
        email,
        verificationCode: code,
      });

      if (response.status === 200) {
        toast.success("Email verified successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
        // Redirect to login or dashboard
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Verification Error:", error);
      if (error.response?.status === 400) {
        toast.error("Invalid verification code", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      } else {
        toast.error("An unexpected error occurred", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
      setError("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="h-screen w-full flex flex-col md:flex-row">
        {/* Left Section - Verification Form */}
        <div className="flex flex-col justify-center items-center w-full mt-10 md:w-2/3 bg-white p-4 md:p-6 lg:p-8">
          <h1 className="font-[MuseoModerno] text-3xl sm:text-4xl md:text-3xl lg:text-6xl font-bold text-center whitespace-nowrap">
            Verify Your Email
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center w-full mt-4 font-[MuseoModerno]"
          >
            <p className="text-lg md:text-xl lg:text-2xl text-center mb-4">
              Check your email ({email}) for a verification code.
            </p>
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            {error && (
              <p className="text-red-500 text-center mt-2">{error}</p>
            )}
            <button
              type="submit"
              className="w-full max-w-sm px-4 py-2 md:py-3 lg:py-4 bg-red-800 mt-4 rounded-full text-white hover:bg-red-600 text-base md:text-lg lg:text-xl font-bold cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
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

export default VerificationPage;