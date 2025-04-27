import React, { useState } from "react";
import { apiCreateAuction } from "../services/auction";


const AddItemModal = ({ onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // const calculateEndTime = (durationInMinutes) => {
  //   const endDate = new Date();
  //   endDate.setMinutes(endDate.getMinutes() + parseInt(durationInMinutes));
  //   return endDate.toISOString();
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setFormErrors({});

    try {
      const formData = new FormData(event.target);
      
      // // Convert duration to endTime (now in minutes)
      // const duration = formData.get('duration');
      // formData.delete('duration'); // Remove duration as backend doesn't use it directly
      // formData.append('endTime', calculateEndTime(duration));
      
      // Convert startingBid to a number
      const startingBid = formData.get('startingBid');
      formData.set('startingBid', Number(startingBid));
      
      // Debug: Log what's being sent to the server
      console.log("Submitting form data:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      const response = await apiCreateAuction(formData);
      
      onSubmit(response.data);
      onClose();
    } catch (err) {
      console.error("Error adding auction item:", err);
      
      if (err.response?.data?.details) {
        // Handle Joi validation errors
        const validationErrors = {};
        err.response.data.details.forEach(detail => {
          validationErrors[detail.path[0]] = detail.message;
        });
        setFormErrors(validationErrors);
        setError("Please fix the errors in the form");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add item. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Add New Auction Item</h2>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {/* Product Name */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Product Name*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className={`mt-1 p-2 w-full border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.title && (
              <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              required
              className={`mt-1 p-2 w-full border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            ></textarea>
            {formErrors.description && (
              <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
            )}
          </div>

          {/* Base Price */}
          <div>
            <label htmlFor="startingBid" className="block text-sm font-medium text-gray-700">
              Starting Bid*
            </label>
            <input
              type="number"
              id="startingBid"
              name="startingBid"
              min="0"
              step="0.01"
              required
              className={`mt-1 p-2 w-full border ${formErrors.startingBid ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.startingBid && (
              <p className="text-red-500 text-xs mt-1">{formErrors.startingBid}</p>
            )}
          </div>

          {/* <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start time*
            </label>
            <input
              type="number"
              id="startTime"
              name="startTime"
              min="1"
              placeholder="e.g. 30 for a 30-minute auction"
              required
              className={`mt-1 p-2 w-full border border-gray-300 rounded-md`}
            />
            <p className="text-xs text-gray-500 mt-1">
             Start Time
            </p>
          </div> */}

          {/* Duration - Will be converted to endTime */}
          {/* <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (in minutes)*
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              placeholder="e.g. 30 for a 30-minute auction"
              required
              className={`mt-1 p-2 w-full border border-gray-300 rounded-md`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter how long the auction should run in minutes (e.g. 5, 15, 30, 60)
            </p>
          </div> */}

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="">Choose a category</option>
              <option value="agricultural products">agricultural products</option>
              <option value="artisan crafts">artisan crafts</option>
              <option value="electronics & gadgets">electronics & gadgets</option>
              <option value="fashion & home decor">fashion & home decor</option>
            </select>
          </div>

          {/* Upload Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload Image*
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              required
              className={`mt-1 p-2 w-full border ${formErrors.image ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.image && (
              <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md disabled:bg-green-300"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;

// 
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [formErrors, setFormErrors] = useState({});

//   const calculateEndTime = (durationInDays) => {
//     const endDate = new Date();
//     endDate.setDate(endDate.getDate() + parseInt(durationInDays));
//     return endDate.toISOString();
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setFormErrors({});

//     try {
//       const formData = new FormData(event.target);
      
//       // Convert duration to endTime
//       const duration = formData.get('duration');
//       formData.delete('duration'); // Remove duration as backend doesn't use it directly
//       formData.append('endTime', calculateEndTime(duration));
      
//       // Convert startingBid to a number
//       const startingBid = formData.get('startingBid');
//       formData.set('startingBid', Number(startingBid));
      
//       // Debug: Log what's being sent to the server
//       console.log("Submitting form data:");
//       for (let [key, value] of formData.entries()) {
//         console.log(`${key}: ${value}`);
//       }
      
//       const response = await apiCreateAuction(formData);
      
//       onSubmit(response.data);
//       onClose();
//     } catch (err) {
//       console.error("Error adding auction item:", err);
      
//       if (err.response?.data?.details) {
//         // Handle Joi validation errors
//         const validationErrors = {};
//         err.response.data.details.forEach(detail => {
//           validationErrors[detail.path[0]] = detail.message;
//         });
//         setFormErrors(validationErrors);
//         setError("Please fix the errors in the form");
//       } else if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else {
//         setError("Failed to add item. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
//         >
//           ×
//         </button>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <h2 className="text-xl font-bold mb-4">Add New Auction Item</h2>
          
//           {error && (
//             <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">
//               {error}
//             </div>
//           )}
          
//           {/* Product Name */}
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//               Product Name*
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               required
//               className={`mt-1 p-2 w-full border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//             />
//             {formErrors.title && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//               Description*
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               rows="3"
//               required
//               className={`mt-1 p-2 w-full border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//             ></textarea>
//             {formErrors.description && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
//             )}
//           </div>

//           {/* Base Price */}
//           <div>
//             <label htmlFor="startingBid" className="block text-sm font-medium text-gray-700">
//               Starting Bid*
//             </label>
//             <input
//               type="number"
//               id="startingBid"
//               name="startingBid"
//               min="0"
//               step="0.01"
//               required
//               className={`mt-1 p-2 w-full border ${formErrors.startingBid ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//             />
//             {formErrors.startingBid && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.startingBid}</p>
//             )}
//           </div>

//           {/* Duration - Will be converted to endTime */}
//           <div>
//             <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
//               Duration (in days)*
//             </label>
//             <input
//               type="number"
//               id="duration"
//               name="duration"
//               min="1"
//               required
//               className={`mt-1 p-2 w-full border border-gray-300 rounded-md`}
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//               Category
//             </label>
//             <select
//               id="category"
//               name="category"
//               required
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//             >
//               <option value="">Choose a category</option>
//               <option value="agricultural products">agricultural products</option>
//               <option value="artisan crafts">artisan crafts</option>
//               <option value="electronics & gadgets">electronics & gadgets</option>
//               <option value="fashion & home decor">fashion & home decor</option>
//             </select>
//           </div>

//           {/* Upload Image */}
//           <div>
//             <label htmlFor="image" className="block text-sm font-medium text-gray-700">
//               Upload Image*
//             </label>
//             <input
//               type="file"
//               id="image"
//               name="image"
//               accept="image/*"
//               required
//               className={`mt-1 p-2 w-full border ${formErrors.image ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//             />
//             {formErrors.image && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>
//             )}
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="button"
//               onClick={onClose}
//               className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-green-500 text-white px-4 py-2 rounded-md disabled:bg-green-300"
//               disabled={isLoading}
//             >
//               {isLoading ? "Adding..." : "Add Item"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddItemModal;