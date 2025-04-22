import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { apiVerifyEmail } from "../services/auth";

const VerifyEmailPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  // Try to pre-fill email from state passed during navigation
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email
      }));
    }
  }, [location.state]);

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
    if (!formData.verificationCode) newErrors.verificationCode = "Verification code is required";
    
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
    setSuccess("");
  
    try {
      // Use the apiVerifyEmail function from auth.js
      const response = await apiVerifyEmail(formData);
      
      console.log("Email verification successful: ", response.data);
  
      // Store the token in local storage if returned
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      
      setSuccess("Email verified successfully! Redirecting...");
      
      // Navigate to the product page after successful verification
      setTimeout(() => {
        navigate("/product");
      }, 2000);
    } catch (error) {
      console.error("Error verifying email:", error.response?.data || error.message);
      setServerError(error.response?.data?.message || "Failed to verify email. Please check your code and try again.");
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

//   const handleResendCode = async () => {
//     if (!formData.email) {
//       setErrors({...errors, email: "Email is required to resend code"});
//       return;
//     }
    
//     setLoading(true);
//     try {
//       // You'll need to implement this endpoint in your backend
//       const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/resend-verification`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email: formData.email }),
//       });
      
//       if (response.ok) {
//         setSuccess("Verification code has been resent to your email");
//       } else {
//         const errorData = await response.json();
//         setServerError(errorData.message || "Failed to resend code");
//       }
//     } catch (error) {
//       setServerError("Failed to resend verification code");
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <>
      <section className="h-screen w-full flex flex-col md:flex-row">
        {/* Left Section - Verification Form */}
        <div className="flex flex-col justify-center items-center w-full mt-20 md:w-2/3 bg-white p-4 md:p-8 lg:p-16">
          <h1 className="font-[MuseoModerno] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center whitespace-nowrap">
            Verify your email
          </h1>
          <p className="text-center mt-4 text-lg md:text-xl lg:text-2xl max-w-md">
            Please enter the verification code sent to your email
          </p>
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4 w-full max-w-md" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          
          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 w-full max-w-md" role="alert">
              <span className="block sm:inline">{serverError}</span>
            </div>
          )}
          
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
              placeholder="Your email address"
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 self-start ml-4 mt-1">{errors.email}</p>}
            
            <input
              className="w-full max-w-md pl-4 py-3 md:py-4 lg:py-5 bg-white mt-4 rounded-full text-black border border-red-800 text-lg md:text-xl lg:text-2xl outline-none focus:ring-0"
              type="text"
              id="verificationCode"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              placeholder="Verification code"
              disabled={loading}
            />
            {errors.code && <p className="text-red-500 self-start ml-4 mt-1">{errors.code}</p>}
            
            <button
              type="submit"
              className="w-full max-w-md px-5 py-3 md:py-4 lg:py-5 bg-red-800 mt-6 rounded-full text-white hover:bg-red-600 text-lg md:text-xl lg:text-2xl font-bold cursor-pointer"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
            
            {/* <button
              type="button"
              onClick={handleResendCode}
              className="mt-4 text-blue-600 hover:text-blue-800 text-lg md:text-xl cursor-pointer"
              disabled={loading}
            >
              Resend verification code
            </button> */}
          </form>
        </div>
      </section>
    </>
  );
};

export default VerifyEmailPage;