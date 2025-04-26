import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./Auth/LoginPage";
import SignupPage from "./Auth/SignupPage";
import LandingPage from "./pages/LandingPage";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./pages/ProductDetail";
import DashboardPage from "./pages/DashboardPage";
import PurchasePage from "./pages/PurchasePage";
import BidderPage from "./pages/BidderPage";
import VerifyEmailPage from "./Auth/verifyPage";
import ProtectedRoute from "./protectedRoute";
import GoogleCallback from "../public/GoogleCallback";
import ResetPassword from "./Auth/resetPassword";
import ForgotPassword from "./Auth/forgetPassword";
import OwnerProductDetail from "./pages/ownerProductDetail";
import AuctionRoom from "./pages/AuctionRoom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/api/v1/reset-password/:token"
            element={<ResetPassword />}
          />

          {/* Protected Routes */}
          <Route
            path="/product"
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }
          />
           <Route
            path="/owner-detail/:id"
            element={
              <ProtectedRoute>
                <OwnerProductDetail />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/detail"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/detail/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchases"
            element={
              <ProtectedRoute>
                <PurchasePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bidder"
            element={
              <ProtectedRoute>
                <BidderPage />
              </ProtectedRoute>
            }
          />
             <Route
            path="/room/:id"
            element={
              <ProtectedRoute>
                <AuctionRoom />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
