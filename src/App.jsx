import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./Auth/LoginPage";
import SignupPage from "./Auth/SignupPage";
import LandingPage from "./pages/LandingPage";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./pages/ProductDetail";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
