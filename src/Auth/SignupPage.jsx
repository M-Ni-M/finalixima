import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiSignup, handleGoogleCallback, initiateGoogleAuth } from "../services/auth";
import vid from "/images/vid.mp4";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Handle Google OAuth callback
  useEffect(() => {
    // Check if this is a callback from Google OAuth
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    
    if (token) {
      handleGoogleCallback(token);
      navigate('/product', { replace: true });
      toast.success("Signup successful!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }
  }, [location, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    // Show validation errors as toast
    if (Object.keys(validationErrors).length > 0) {
      const errorMessage = Object.values(validationErrors)
        .map((err, i) => `${i + 1}. ${err}`)
        .join("\n"); // Format errors as a list
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiSignup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      console.log("Signup successful:", response.data);

      toast.success("Signup successful! Check your email for verification.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });

      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
        {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    initiateGoogleAuth();
  };

  return (
    <>
      <ToastContainer />
      <section className="h-screen w-full flex flex-col md:flex-row">
          {/* Back Button */}
          <button
          type="button"
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
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-3 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              disabled={loading}
            />

            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-3 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              disabled={loading}
            />

            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-3 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              disabled={loading}
            />

            <input
              className="w-full max-w-sm pl-3 py-2 md:py-3 lg:py-3 bg-white mt-3 rounded-full text-black border border-red-800 text-base md:text-lg lg:text-xl outline-none focus:ring-0"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              disabled={loading}
            />

            <button
              type="submit"
              className="w-full max-w-sm px-4 py-2 md:py-3 lg:py-3 bg-red-800 mt-4 rounded-full text-white hover:bg-red-600 text-base md:text-lg lg:text-xl font-bold cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>

            <p className="text-base md:text-lg lg:text-xl my-3">or signup with</p>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full max-w-sm px-4 py-2 md:py-3 lg:py-3 bg-blue-800 rounded-full text-white hover:bg-blue-600 text-base md:text-lg lg:text-xl font-bold cursor-pointer"
              disabled={loading}
            >
              Google
            </button>

            <div className="max-w-full gap-2 flex-col text-center  flex justify-between mt-4">
              <Link
                to="/login"
                className="cursor-pointer text-blue-800 hover:text-blue-600"
              >
                Already have an account? <span className="font-bold">Log in</span>
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