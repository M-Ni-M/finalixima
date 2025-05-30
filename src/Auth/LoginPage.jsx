import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  apiLogin,
  handleGoogleCallback,
  initiateGoogleAuth,
} from "../services/auth";
import vid from "/images/vid.mp4"; // Ensure this path is correct
import BackButton from "../components/BackButton";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Handle Google OAuth callback
  useEffect(() => {
    // Check if this is a callback from Google OAuth
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      handleGoogleCallback(token);
      navigate("/product", { replace: true });
      toast.success("Login successful!", {
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
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      const errorMessage = Object.values(validationErrors)
        .map((err, i) => `${i + 1}. ${err}`)
        .join("\n");
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiLogin(formData);

      if (import.meta.env.DEV) {
        console.log("Login successful:", response.data);
      }

      localStorage.setItem("authToken", response.data.accessToken);
      localStorage.setItem("userId", response.data.user.id);

      console.log("Before displaying success toast");

      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });

      console.log("Success toast displayed");

      // Adding delay to ensure the toast is displayed
      setTimeout(() => {
        navigate("/product", { replace: true });
      }, 500);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Login failed:", error.response?.data || error.message);
      }

      let finalMessage = "An unexpected error occurred";

      if (error.response) {
        if (error.response.status === 404) {
          finalMessage = "Email is incorrect";
        } else if (error.response.status === 401) {
          finalMessage = "Password is incorrect";
        } else {
          const backendMessage = error.response?.data?.message;

          if (typeof backendMessage === "string") {
            finalMessage = backendMessage;
          } else if (Array.isArray(backendMessage)) {
            finalMessage = backendMessage.join("\n");
          } else if (
            typeof backendMessage === "object" &&
            backendMessage !== null
          ) {
            finalMessage = Object.values(backendMessage).join("\n");
          }
        }
      }

      toast.error(finalMessage, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    initiateGoogleAuth();
  };

  return (
    <>
      <ToastContainer />
      <section className="h-screen w-full flex flex-col md:flex-row relative">
    


        <div className="flex flex-col justify-center items-center w-full md:w-2/3 bg-white p-4 md:p-8 lg:p-10">
            <BackButton/><h1 className="font-[MuseoModerno] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center whitespace-nowrap mt-5">
            Welcome back
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center w-full mt-6 font-[MuseoModerno]"
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full max-w-md pl-4 py-3 md:py-4 lg:py-3 bg-white mt-4 rounded-full text-black border border-red-800 text-lg md:text-xl lg:text-2xl outline-none focus:ring-0"
              required
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full max-w-md pl-4 py-3 md:py-4 lg:py-3 bg-white mt-4 rounded-full text-black border border-red-800 text-lg md:text-xl lg:text-2xl outline-none focus:ring-0"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-md px-5 py-3 md:py-4 lg:py-3 bg-red-800 mt-6 rounded-full text-white hover:bg-red-600 text-lg md:text-xl lg:text-2xl font-bold cursor-pointer disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-lg md:text-xl lg:text-xl my-3">or login with</p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full max-w-md px-5 py-3 md:py-4 lg:py-3 bg-blue-800 rounded-full text-white hover:bg-blue-600 text-lg md:text-xl lg:text-xl font-bold cursor-pointer"
            >
              Google
            </button>

            <div className="max-w-full gap-2 flex-col text-center flex justify-between mt-4">
              <Link
                to="/signup"
                className="cursor-pointer text-blue-800 hover:text-blue-600"
              >
                Don't have an account?{" "}
                <span className="font-bold">Sign Up</span>
              </Link>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* Remember me checkbox if you have one */}
                </div>

                <div className="text-sm">
                  <a
                    href="/forgot-password"
                    className="font-medium text-black hover:text-gray-800"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>

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
