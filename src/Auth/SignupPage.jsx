import React, { useState } from "react";
import vid from "/images/vid.mp4"; // Import the video file
import { useNavigate } from "react-router";
import { apiSignup } from "../services/auth";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
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
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
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
      // Call signup API
      const response = await apiSignup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      console.log("Signup successful: ", response.data);
      
      // Navigate to email verification page with email in state
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      console.error("Error signing up:", error.response?.data || error.message);
      setServerError(error.response?.data?.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="h-screen w-full flex flex-col md:flex-row">
        {/* Left Section - Signup Form */}
        <div className="flex flex-col justify-center items-center w-full mt-10 md:w-2/3 bg-white p-4 md:p-6 lg:p-8">
          <h1 className="font-[MuseoModerno] text-3xl sm:text-4xl md:text-3xl lg:text-6xl font-bold text-center whitespace-nowrap">
            Signup to start bidding
          </h1>
          
          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 w-full max-w-sm" role="alert">
              <span className="block sm:inline">{serverError}</span>
            </div>
          )}
          
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center w-full mt-4 font-[MuseoModerno]"
          >
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              disabled={loading}
            />
            {errors.username && <p className="text-red-500 self-start ml-4 mt-1 text-sm">{errors.username}</p>}
            
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 self-start ml-4 mt-1 text-sm">{errors.email}</p>}
            
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              disabled={loading}
            />
            {errors.password && <p className="text-red-500 self-start ml-4 mt-1 text-sm">{errors.password}</p>}
            
            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-4 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              disabled={loading}
            />
            {errors.confirmPassword && <p className="text-red-500 self-start ml-4 mt-1 text-sm">{errors.confirmPassword}</p>}
            
            <button
              type="submit"
              className="w-full max-w-sm px-4 py-2 md:py-3 lg:py-4 bg-red-800 mt-4 rounded-full text-white hover:bg-red-600 text-base md:text-lg lg:text-xl font-bold cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
            
            <p className="text-base md:text-lg lg:text-xl my-2">
              or signup with
            </p>
            
            <button
              type="button"
              className="w-full max-w-sm px-4 py-2 md:py-3 lg:py-4 bg-blue-800 mt-2 rounded-full text-white hover:bg-blue-600 text-base md:text-lg lg:text-xl font-bold cursor-pointer"
              disabled={loading}
            >
              Google
            </button>
            
            <div className="w-full max-w-sm flex justify-between mt-4">
              <p className="cursor-pointer text-blue-800 hover:text-blue-600">
                Already have an account? <span className="font-bold">Log in</span>
              </p>
              <p className="cursor-pointer text-blue-800 hover:text-blue-600">
                Forgot password?
              </p>
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