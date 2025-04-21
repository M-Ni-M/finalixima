// src/components/AddItemModal.jsx
import React from "react";

const AddItemModal = ({ onClose, onSubmit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newItem = {
      id: Date.now(), // Using timestamp for unique ID
      name: formData.get("name"),
      description: formData.get("description"),
      basePrice: formData.get("basePrice"),
      duration: formData.get("duration"),
      category: formData.get("category"),
      image: formData.get("image"), // File input
    };
    onSubmit(newItem);
    onClose(); // Close the modal after adding the item
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[30vw] relative max-w-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Add New Auction Item</h2>
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            ></textarea>
          </div>

          {/* Base Price */}
          <div>
            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
              Base Price*
            </label>
            <input
              type="number"
              id="basePrice"
              name="basePrice"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (in days)*
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

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
              <option value="food">Food</option>
              <option value="electronics">Electronics</option>
              <option value="sports">Sports</option>
              {/* Add more categories as needed */}
            </select>
          </div>

          {/* Upload Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;