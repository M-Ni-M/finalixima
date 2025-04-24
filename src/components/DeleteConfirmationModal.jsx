import React from "react";

// const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-96 max-w-md">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
//         <p className="text-sm text-gray-500 mb-6">
//           Are you sure you want to delete {itemName || "this item"}? This action cannot be undone.
//         </p>
//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeleteConfirmationModal;

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;
    
    console.log("DeleteConfirmationModal - Item name:", itemName);
    
    const handleConfirm = () => {
      console.log("Delete confirmation clicked");
      onConfirm();
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete {itemName || "this item"}? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteConfirmationModal;