import React from "react";
import { Link } from "react-router";
import { apiDeleteAuctionItem } from "../services/auction";

const AuctionsTable = ({ products, onRefresh, isOwnerView = true }) => {
  console.log("Products received in AuctionsTable:", products);
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        console.log("Deleting item with ID:", id); // Add this log
        console.log("ID type:", typeof id); // Check the type of ID
        await apiDeleteAuctionItem(id);
        alert("Item deleted successfully");
        onRefresh();
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      }
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-md p-8 text-center">
        <p className="font-[MuseoModerno] text-lg">No auction items found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Added
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Bid
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {product.category || "Uncategorized"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.date}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${product.currentBid || product.startingBid}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                {isOwnerView ? (
                  <Link
                    to={`/owner-detail/${product.id}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500"
                  >
                    View as Owner
                  </Link>
                ) : (
                  <Link
                    to={`/detail/${product.id}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500"
                  >
                    View
                  </Link>
                )}
                <button
                  onClick={() => {
                    // Make sure to extract just the ID
                    const itemId = product.id;
                    console.log("Attempting to delete item with ID:", itemId);
                    handleDelete(itemId);
                  }}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuctionsTable;
// const AuctionsTable = ({ products, onRefresh }) => {
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       try {
//         await apiDeleteAuction(id);
//         alert("Item deleted successfully");
//         onRefresh(); // Refresh the list after deletion
//       } catch (error) {
//         console.error("Error deleting item:", error);
//         alert("Failed to delete item. Please try again.");
//       }
//     }
//   };

//   if (products.length === 0) {
//     return (
//       <div className="bg-white rounded-md p-8 text-center">
//         <p className="font-[MuseoModerno] text-lg">No auction items found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-md overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Item
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Category
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Date Added
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Status
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Current Bid
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {products.map((product) => (
//             <tr key={product.id}>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 h-10 w-10">
//                     <img
//                       className="h-10 w-10 rounded-full object-cover"
//                       src={product.image}
//                       alt={product.name}
//                     />
//                   </div>
//                   <div className="ml-4">
//                     <div className="text-sm font-medium text-gray-900">
//                       {product.name}
//                     </div>
//                   </div>
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="text-sm text-gray-900">{product.category || "Uncategorized"}</div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="text-sm text-gray-900">{product.date}</div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                   product.status === "Active"
//                     ? "bg-green-100 text-green-800"
//                     : "bg-gray-100 text-gray-800"
//                 }`}>
//                   {product.status}
//                 </span>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                 ${product.currentBid || product.startingBid}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
//                 <Link
//                   to={`/detail/${product.id}`}
//                   className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500"
//                 >
//                   View
//                 </Link>
//                 <button
//                   onClick={() => handleDelete(product.id)}
//                   className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-500"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
// export default AuctionsTable;

// const AuctionsTable = ({ products, onRefresh }) => {
//   // Check if products is an array and has items
//   const hasProducts = Array.isArray(products) && products.length > 0;

//   return (
//     <div className="w-full bg-white shadow-md rounded-lg overflow-hidden mx-auto font-[MuseoModerno] mt-5">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               #
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Products
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Starting Bid
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Auction Start Date
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Status
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {hasProducts ? (
//             products.map((product, index) => (
//               <tr key={product.id || index}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {index + 1}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10">
//                       {/* Product Image */}
//                       <img
//                         className="h-10 w-10 rounded-full object-cover"
//                         src={product.image || "https://via.placeholder.com/50"}
//                         alt={product.name}
//                       />
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">
//                         {product.name}
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">${product.startingBid}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{product.date}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
//                     product.status === "Active"
//                       ? "bg-green-100 text-green-800"
//                       : product.status === "Completed"
//                       ? "bg-gray-100 text-gray-800"
//                       : "bg-yellow-100 text-yellow-800"
//                   }`}>
//                     {product.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <Link
//                     to={`/detail/${product.id}`}
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//                   >
//                     More Details
//                   </Link>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
//                 No auction items found. Add your first item!
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AuctionsTable;
