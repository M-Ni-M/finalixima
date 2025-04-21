// src/pages/DashboardPage.jsx
import React, { useState } from "react";
import AddItemModal from "../components/AdditemModal"; // Import the AddItemModal component
import { CiFilter } from "react-icons/ci";
import { Link } from "react-router";
import DropdownMenu from "../components/DropdownMenu";
import PurchasesTable from "../components/PurchaseTable";

const PurchasePage = () => {
  // State to manage the list of products
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'MacBook Pro 13"',
      image: "https://via.placeholder.com/60?text=MBP",
      category: "Laptop",
      date: "2023-10-05",
      status: "Delivered",
    },
    {
      id: 2,
      name: "Apple Watch Ultra",
      image: "https://via.placeholder.com/60?text=AWU",
      category: "Watch",
      date: "2023-10-07",
      status: "Pending",
    },
    // ... other products
  ]);

  // State to manage modal visibility
  const [showModal, setShowModal] = useState(false);

  // Function to handle form submission
  const handleAddItem = (newItem) => {
    setProducts([...products, newItem]);
  };

  return (
    <section className="flex flex-col w-full h-screen">
      {/* Main Content */}
      <div className="flex items-center bg-red-600 w-full fixed p-3 justify-between">
        <div className="flex items-center w-[20%]">
          <img src="/images/bb.png" width={50} alt="Logo" className="mr-2" />
          <h1 className="font-[MuseoModerno] font-medium text-2xl text-white">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center justify-evenly w-full max-w-sm h-[7vh] rounded-full my-5 text-black bg-white text-l font-medium font-[MuseoModerno]">
  <Link to="/product">
    <p className="flex items-center justify-center hover:text-red-600">Home</p>
  </Link>
  <Link to="/dashboard">
    <p className="hover:text-red-600">Auctions</p>
  </Link>
  <Link to="/purchases">
    <p className="text-red-600">Purchases</p>
  </Link>
</div>
        <div className="flex justify-center items-center w-[10%]">
        <DropdownMenu />

        </div>
      </div>

      <div className="flex flex-col bg-gray-100 w-full min-h-fit gap-5 p-10 pt-40 justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col w-full h-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
            <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
            <p className="font-[MuseoModerno] font-medium">Total Purchases</p>
            <h1 className="font-[MuseoModerno] font-bold text-2xl">13</h1>
          </div>
          <div className="flex flex-col w-full h-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
            <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
            <p className="font-[MuseoModerno] font-medium">
              Total Amount Spent
            </p>
            <h1 className="font-[MuseoModerno] font-bold text-2xl">13</h1>
          </div>
          <div className="flex flex-col w-full h-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
            <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
            <p className="font-[MuseoModerno] font-medium">
              Total Auctioned Items
            </p>
            <h1 className="font-[MuseoModerno] font-bold text-2xl">13</h1>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-5">
            <button className="rounded-md bg-white border border-gray-300 p-2 flex items-center justify-center">
              <CiFilter />
            </button>
            <input
              className="bg-white rounded-md border border-gray-300 p-2 w-full md:w-3/4 pl-4 font-medium"
              placeholder="Search"
              type="search"
              name=""
              id=""
            />
          </div>
        </div>

        <PurchasesTable products={products} />

        {/* Modal */}
        {showModal && (
          <AddItemModal
            onClose={() => setShowModal(false)}
            onSubmit={handleAddItem}
          />
        )}
      </div>
    </section>
  );
};

export default PurchasePage;
