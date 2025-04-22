import React from "react";
import ProductCard from "../components/ProductCard";
import Nav from "../components/Nav";

const ProductPage = () => {
  return (
    <>
      <Nav />
      <section className="w-full h-full flex flex-col items-center bg-[#F2F2F2] pt-30">
        <div className="w-full px-10 flex items-start"><button
          type="button"
          onClick={() => window.history.back()}
          className="font-[MuseoModerno] font-bold text-2xl text-black hover:text-gray-600 cursor-pointer"
        >
          ← Go Back
        </button></div>
      
        <div className="flex items-center justify-evenly w-full max-w-sm h-[7vh] rounded-full my-5 text-black bg-white text-l font-medium font-[MuseoModerno]">
          <p className="flex items-center justify-center">All</p>
          <p>Live</p>
          <p>Lifestyle</p>
          <p>Technology</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-center w-[80vw] min-h-screen">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard /> 
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </section>
    </>
  );
};

export default ProductPage;
