import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { apiUserLogin } from "../services/auth";
import vid from "/images/vid.mp4"; // Ensure this path is correct

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiUserLogin({
        username: formData.username.trim(),
        password: formData.password.trim(),
      });

      console.log("API Response:", response);

      const token = response?.data?.token;

      if (response.status === 200 && token) {
        localStorage.setItem("token", token);
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
        navigate("/product");
        setFormData({ username: "", password: "" });
      } else {
        toast.error("Invalid response format", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response?.status === 401) {
        toast.error("Invalid username or password", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error("An unexpected error occurred", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
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
      <section className="h-screen w-full flex flex-col md:flex-row relative">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 font-[MuseoModerno] font-bold text-2xl text-black hover:text-gray-600 cursor-pointer"
        >
          ← Go Back
        </button>

        {/* Left Section - Login Form */}
        <div className="flex flex-col justify-center items-center w-full mt-20 md:w-2/3 bg-white p-4 md:p-8 lg:p-16">
          <h1 className="font-[MuseoModerno] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center whitespace-nowrap">
            Welcome back
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center w-full mt-6 font-[MuseoModerno]"
          >
            <input
              className="w-full max-w-md pl-4 py-3 md:py-4 lg:py-5 bg-white mt-4 rounded-full text-black border border-red-800 text-lg md:text-xl lg:text-2xl outline-none focus:ring-0"
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              className="w-full max-w-md pl-4 py-3 md:py-4 lg:py-5 bg-white mt-4 rounded-full text-black border border-red-800 text-lg md:text-xl lg:text-2xl outline-none focus:ring-0"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-md px-5 py-3 md:py-4 lg:py-5 bg-red-800 mt-6 rounded-full text-white hover:bg-red-600 text-lg md:text-xl lg:text-2xl font-bold cursor-pointer disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-lg md:text-xl lg:text-2xl my-5">or login with</p>
            <button
              type="button"
              className="w-full max-w-md px-5 py-3 md:py-4 lg:py-5 bg-blue-800 mt-3 rounded-full text-white hover:bg-blue-600 text-lg md:text-xl lg:text-2xl font-bold cursor-pointer"
            >
              Google
            </button>
            <div className="w-full text-right font-bold mt-3 text-blue-950">
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

export default LoginPage;
