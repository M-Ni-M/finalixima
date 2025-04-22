import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import vid from "/images/vid.mp4";
import { apiRegisterUser } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await apiRegisterUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        confirmPassword: formData.confirmPassword.trim(),
      });

      if (response.status === 200 && response.data.userId) {
        toast.success("Registration successful! Check your email for verification.", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
        navigate(`/verify?email=${formData.email}`);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message, {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="h-screen w-full flex flex-col md:flex-row">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 font-[MuseoModerno] font-bold text-2xl text-black hover:text-gray-600 cursor-pointer"
        >
          ← Go Back
        </button>

        {/* Left Section - Signup Form */}
        <div className="flex flex-col justify-center items-center w-full mt-10 md:w-2/3 bg-white p-4 md:p-6 lg:p-8">
          <h1 className="font-[MuseoModerno] text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-center whitespace-nowrap">
            Signup to start bidding
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center w-full mt-4 font-[MuseoModerno]"
          >
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full max-w-sm px-4 py-2 md:py-3 lg:py-4 bg-red-800 mt-4 rounded-full text-white hover:bg-red-600 text-base md:text-lg lg:text-xl font-bold cursor-pointer"
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
            <p className="text-base md:text-lg lg:text-xl my-2">or signup with</p>
            <button
              type="button"
              className="w-full max-w-sm px-4 py-2 md:py-3 lg:py-4 bg-blue-800 mt-2 rounded-full text-white hover:bg-blue-600 text-base md:text-lg lg:text-xl font-bold cursor-pointer"
            >
              Google
            </button>
            <div className="w-full text-right font-bold mt-2 text-blue-950">
              <Link to="/forgot-password" className="cursor-pointer">
                Forgot password?
              </Link>
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