import React, { useState } from 'react';

const DropdownMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false); // Close the dropdown when opening the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const userProfile = {
    username: 'JohnDoe',
    email: 'johndoe@example.com',
    residentialAddress: '123 Main St, Anytown, USA',
    phoneNumber: '+1 (555) 123-4567',
  };

  return (
    <div className="relative">
      <div
        onClick={toggleDropdown}
        className="font-[MuseoModerno] flex items-center justify-center w-[3vw] h-[3vw] rounded-[50%] bg-amber-50 cursor-pointer"
      >
        M
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-10">
          <button
            onClick={openModal}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Profile
          </button>
          <button
            onClick={() => alert('Logout')}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-20">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
              <p className="text-gray-700">{userProfile.username}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <p className="text-gray-700">{userProfile.email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Residential Address:</label>
              <p className="text-gray-700">{userProfile.residentialAddress}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
              <p className="text-gray-700">{userProfile.phoneNumber}</p>
            </div>
            <button
              onClick={closeModal}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;