import React, { useState } from "react";
import vid from "/images/vid.mp4"; // Import the video file
import { Link, useNavigate } from "react-router";
import { apiLogin } from "../services/auth";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "E-mail is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setServerError("");
  
    try {
      // Use the apiLogin function from auth.js instead of fetch
      const response = await apiLogin(formData);
      
      console.log("Login successful: ", response.data);
  
      // Store the token in local storage
      localStorage.setItem("authToken", response.data.token);
      // Navigate to the product page after successful login
      navigate("/product");
      alert("Login Successful!");
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);
      setServerError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <>
      <section className="h-screen w-full flex flex-col md:flex-row">
        {/* Left Section - Login Form */}
        <div className="flex flex-col justify-center items-center w-full mt-20 md:w-2/3 bg-white p-4 md:p-8 lg:p-16">
          <h1 className="font-[MuseoModerno] text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-center whitespace-nowrap">
            Welcome back
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center w-full mt-6 font-[MuseoModerno]"
          >
            <input
              className="w-full max-w-md pl-4 py-3 md:py-4 lg:py-5 bg-white mt-4 rounded-full text-black border border-red-800 text-lg md:text-xl lg:text-2xl outline-none focus:ring-0"
              type="email"
              id="email"
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 self-start ml-4">{errors.email}</p>}
            
            <input
              className="w-full max-w-md pl-4 py-3 md:py-4 lg:py-5 bg-white mt-4 rounded-full text-black border border-red-800 text-lg md:text-xl lg:text-2xl outline-none focus:ring-0"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 self-start ml-4">{errors.password}</p>}
            
            {serverError && <p className="text-red-500 mt-2">{serverError}</p>}
            
            <button
              type="submit"
              className="w-full max-w-md px-5 py-3 md:py-4 lg:py-5 bg-red-800 mt-6 rounded-full text-white hover:bg-red-600 text-lg md:text-xl lg:text-2xl font-bold cursor-pointer"
              disabled={loading}
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