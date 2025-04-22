// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import AddItemModal from "../components/AdditemModal"; // Import the AddItemModal component
import { CiFilter } from "react-icons/ci";
import { Link } from "react-router";
import DropdownMenu from "../components/DropdownMenu";
import AuctionsTable from "../components/AuctionsTable";
import { apiCreateAuction, apiGetAllAuctions, apiGetUserAuctions } from "../services/auction";

// const DashboardPage = () => {
//   // State to manage the list of auction items
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [totalItems, setTotalItems] = useState(0);

//   // Function to fetch all auction items
//   const fetchAuctions = async () => {
//     setIsLoading(true);
//     try {
//       const response = await apiGetAllAuctions();
      
//       // Check if the response contains items and format them for the table
//       if (response.data && response.data.items) {
//         // Format the items to match your table component's expected structure
//         const formattedItems = response.data.items.map(item => ({
//           id: item._id,
//           name: item.title,
//           image: item.image || `https://res.cloudinary.com/dyfpxokoj/image/upload/${image}`,
//           category: item.category || "Uncategorized",
//           date: new Date(item.createdAt).toLocaleDateString(),
//           status: item.status || "Active",
//           startingBid: item.startingBid,
//           endTime: item.endTime,
//           description: item.description,
//           // Add other fields as needed
//         }));
        
//         setProducts(formattedItems);
//         setTotalItems(formattedItems.length);
//       } else {
//         setProducts([]);
//         setTotalItems(0);
//       }
//     } catch (err) {
//       console.error("Error fetching auctions:", err);
//       setError("Failed to load auction items. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch items when component mounts
//   useEffect(() => {
//     fetchAuctions();
//   }, []);

//   // Function to handle adding a new item
//   const handleAddItem = async (formData) => {
//     try {
//       await apiCreateAuction(formData);
//       // Refresh the auctions list after adding a new item
//       fetchAuctions();
//       // Close the modal
//       setShowModal(false);
//     } catch (error) {
//       console.error("Error adding item:", error);
//       // You might want to show an error message to the user
//     }
//   };

//   // Filter items based on search term
//   const filteredProducts = searchTerm 
//     ? products.filter(product => 
//         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.category.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : products;

//   return (
//     <section className="flex flex-col w-full h-screen">
//       {/* Main Content */}
//       <div className="flex items-center bg-red-600 w-full fixed p-3 justify-between">
//         <div className="flex items-center w-[20%]">
//           <img src="/images/bb.png" width={50} alt="Logo" className="mr-2" />
//           <h1 className="font-[MuseoModerno] font-medium text-2xl text-white">
//             Dashboard
//           </h1>
//         </div>
        
//         <div className="flex items-center justify-evenly w-full max-w-sm h-[7vh] rounded-full my-5 text-black bg-white text-l font-medium font-[MuseoModerno]">
//           <Link to="/product">
//             <p className="flex items-center justify-center hover:text-red-600">Home</p>
//           </Link>
//           <Link to="/dashboard">
//             <p className="text-red-600">Auctions</p>
//           </Link>
//           <Link to="/purchases">
//             <p className="hover:text-red-600">Purchases</p>
//           </Link>
//         </div>
//         <div className="flex justify-center items-center w-[10%]">
//           <DropdownMenu />
//         </div>
//       </div>

//       <div className="flex flex-col bg-gray-100 w-full min-h-fit gap-5 p-10 pt-40 justify-center">
//         <div className="w-full px-10 flex items-start">
//           <button
//             type="button"
//             onClick={() => window.history.back()}
//             className="font-[MuseoModerno] font-bold text-2xl text-black hover:text-gray-600 cursor-pointer"
//           >
//             ← Go Back
//           </button>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           <div className="flex flex-col w-full h-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
//             <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
//             <p className="font-[MuseoModerno] font-medium">
//               Total Auctioned Items
//             </p>
//             <h1 className="font-[MuseoModerno] font-bold text-2xl">{totalItems}</h1>
//           </div>
//           <div className="flex flex-col w-full h-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
//             <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
//             <p className="font-[MuseoModerno] font-medium">
//               Active Auctions
//             </p>
//             <h1 className="font-[MuseoModerno] font-bold text-2xl">
//               {products.filter(item => item.status === "Active").length}
//             </h1>
//           </div>
//           <div className="flex flex-col w-full h-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
//             <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
//             <p className="font-[MuseoModerno] font-medium">
//               Completed Auctions
//             </p>
//             <h1 className="font-[MuseoModerno] font-bold text-2xl">
//               {products.filter(item => item.status === "Completed").length}
//             </h1>
//           </div>
//         </div>

//         <div className="flex justify-between">
//           <div className="flex items-center gap-5">
//             <button className="rounded-md bg-white border border-gray-300 p-2 flex items-center justify-center">
//               <CiFilter />
//             </button>
//             <input
//               className="bg-white rounded-md border border-gray-300 p-2 w-full md:w-3/4 pl-4 font-medium"
//               placeholder="Search"
//               type="search"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="p-2 px-6 bg-red-600 rounded-md font-[MuseoModerno] font-medium text-s text-white cursor-pointer"
//           >
//             Add Item
//           </button>
//         </div>

//         {isLoading ? (
//           <div className="text-center py-10">
//             <p className="font-[MuseoModerno] text-lg">Loading auction items...</p>
//           </div>
//         ) : error ? (
//           <div className="text-center py-10">
//             <p className="font-[MuseoModerno] text-lg text-red-600">{error}</p>
//             <button 
//               onClick={fetchAuctions}
//               className="mt-4 p-2 bg-red-600 text-white rounded-md"
//             >
//               Try Again
//             </button>
//           </div>
//         ) : (
//           <AuctionsTable products={filteredProducts} onRefresh={fetchAuctions} />
//         )}

//         {/* Modal */}
//         {showModal && (
//           <AddItemModal
//             onClose={() => setShowModal(false)}
//             onSubmit={handleAddItem}
//           />
//         )}
//       </div>
//     </section>
//   );
// };

// export default DashboardPage;

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  // Function to fetch all auction items
  const fetchAuctions = async () => {
    setIsLoading(true);
    try {
      const response = await apiGetUserAuctions();
      
      // Check if the response contains items and format them for the table
      if (response.data && response.data.items) {
        // Format the items to match your table component's expected structure
        const formattedItems = response.data.items?.map(item => ({
          id: item._id,
          name: item.title,
          image: item.image ? `https://res.cloudinary.com/dyfpxokoj/image/upload/${item.image}` : "https://via.placeholder.com/60?text=No+Image",
          date: new Date(item.createdAt).toLocaleDateString(),
          status: new Date(item.endTime) > new Date() ? "Active" : "Completed",
          startingBid: item.startingBid,
          currentBid: item.currentBid || item.startingBid,
          description: item.description,
          endTime: new Date(item.endTime).toLocaleDateString()
        }));
        
        setProducts(formattedItems);
        setTotalItems(formattedItems.length);
      } else {
        setProducts([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Error fetching auctions:", err);
      setError("Failed to load auction items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch items when component mounts
  useEffect(() => {
    fetchAuctions();
  }, []);

  // Function to handle adding a new item
  const handleAddItem = async (responseData) => {
    console.log("Item added successfully:", responseData);
    // Refresh the auctions list after adding a new item
    fetchAuctions();
    // Close the modal (this is called in the modal now)
  };

  // Filter items based on search term
  const filteredProducts = searchTerm 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  // Count active auctions
  const activeAuctions = products.filter(item => item.status === "Active").length;
  // Count completed auctions
  const completedAuctions = products.filter(item => item.status === "Completed").length;

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
            <p className="text-red-600">Auctions</p>
          </Link>
          <Link to="/purchases">
            <p className="hover:text-red-600">Purchases</p>
          </Link>
        </div>
        <div className="flex justify-center items-center w-[10%]">
          <DropdownMenu />
        </div>
      </div>

      <div className="flex flex-col bg-gray-100 w-full min-h-fit gap-5 p-10 pt-40 justify-center">
        <div className="w-full px-10 flex items-start">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="font-[MuseoModerno] font-bold text-2xl text-black hover:text-gray-600 cursor-pointer"
          >
            ← Go Back
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col w-full h-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
            <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
            <p className="font-[MuseoModerno] font-medium">
              Total Auctioned Items
            </p>
            <h1 className="font-[MuseoModerno] font-bold text-2xl">{totalItems}</h1>
          </div>
          <div className="flex flex-col w-full h-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
            <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
            <p className="font-[MuseoModerno] font-medium">
              Active Auctions
            </p>
            <h1 className="font-[MuseoModerno] font-bold text-2xl">{activeAuctions}</h1>
          </div>
          <div className="flex flex-col w-full h-full rounded-2xl border gap-5 p-5 border-gray-300 bg-white">
            <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
            <p className="font-[MuseoModerno] font-medium">
              Completed Auctions
            </p>
            <h1 className="font-[MuseoModerno] font-bold text-2xl">{completedAuctions}</h1>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="p-2 px-6 bg-red-600 rounded-md font-[MuseoModerno] font-medium text-s text-white cursor-pointer"
          >
            Add Item
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <p className="font-[MuseoModerno] text-lg">Loading auction items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="font-[MuseoModerno] text-lg text-red-600">{error}</p>
            <button 
              onClick={fetchAuctions}
              className="mt-4 p-2 bg-red-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <AuctionsTable products={filteredProducts} onRefresh={fetchAuctions} />
        )}

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

export default DashboardPage;