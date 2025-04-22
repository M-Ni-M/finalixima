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
import VerificationPage from "./pages/VerificationPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/detail" element={<ProductDetail />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/purchases" element={<PurchasePage />} />
          <Route path="/bidder" element={<BidderPage />} />
          <Route path="/verify" element={<VerificationPage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
