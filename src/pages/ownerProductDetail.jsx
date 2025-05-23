import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Nav from "../components/Nav";
import Carousel from "../components/Carousel";
import { apiGetAuctionById, apiStartAuction, apiUpdateAuction } from "../services/auction";
import Countdown from 'react-countdown';

const OwnerProductDetail = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  // State variables
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [auctionId, setAuctionId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    category: "",
    startingBid: 0,
    condition: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [auctionTimeReached, setAuctionTimeReached] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError("No item ID provided");
          setLoading(false);
          return;
        }

        const response = await apiGetAuctionById(id);
        setAuctionId(response.data._id || response.data.id);
        console.log("response", response);

        if (response.data) {
          setItem(response.data);
          setEditFormData({
            title: response.data.title || "",
            description: response.data.description || "",
            category: response.data.category || "",
            startingBid: response.data.startingBid || 0,
            condition: response.data.condition || "New",
          });

          // Check if current user is the owner
          const userId = localStorage.getItem("userId");
          const isUserOwner = userId === response.data.id;
          setIsOwner(isUserOwner);

        
        } else {
          setError("Item details not found");
        }
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError("Failed to load item details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();

    return () => {};
  }, [id, navigate]);

  // Set up timer countdown if auction is active
  useEffect(() => {
    let timerId;
    
    if (item?.status === "active" && timeRemaining !== null) {
      // Update timer every second
      timerId = setInterval(() => {
        setTimeRemaining(prevTime => {
          const newTime = prevTime - 1000;
          
          // If time is up, check if the auction should be closed
          if (newTime <= 0) {
            clearInterval(timerId);
            
            // Check if the actual end time has passed
            const now = new Date();
            const endTime = new Date(item.endTime);
            
            if (now >= endTime) {
              // Update local state to show auction as closed
              setItem(prev => ({
                ...prev,
                status: "closed"
              }));
            }
            
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [item, timeRemaining]);

  // Modified handleStartAuction to set 2-minute duration
  const handleStartAuction = async () => {
    try {

      const response = await apiStartAuction(auctionId) 
      console.log("start auction:", response)
      // Calculate the end time (2 minutes from now)
      const now = new Date();
      const endTime = new Date(now.getTime() + 300 * 1000); // 2 minutes
  
      // Directly update local item state
      setItem(item => ({
        ...item,
        status: "active",
        startTime: now.toISOString(),
        endTime: endTime.toISOString()
      }));
  
      // Set the timer for countdown (2 minutes in milliseconds)
      setTimeRemaining(300 * 1000);
  
      // Optionally: Start navigating to auction room if you want
      // navigate(`/room/${id}`);
    } catch (error) {
      console.error("Error starting auction:", error);
    }
  };
  
  

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (item) {
      setEditFormData({
        title: item.title || "",
        description: item.description || "",
        category: item.category || "",
        startingBid: item.startingBid || 0,
        condition: item.condition || "New",
      });
      setPreviewImage(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      setEditFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL for the image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (name === "startingBid") {
      setEditFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value),
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (const key in editFormData) {
        if (editFormData[key] !== null) {
          formData.append(key, editFormData[key]);
        }
      }

      const response = await apiUpdateAuction(id, formData);

      if (response.data) {
        setItem(response.data);
        setIsEditing(false);
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Format remaining time as mm:ss
  const formatTimeRemaining = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return "00:00";
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <>
        <Nav />
        <section className="w-full h-screen flex items-center justify-center bg-[#F2F2F2] pt-[4vh]">
          <p className="font-[MuseoModerno] text-xl">Loading item details...</p>
        </section>
      </>
    );
  }

  if (error || !item) {
    return (
      <>
        <Nav />
        <section className="w-full h-screen flex flex-col items-center justify-center bg-[#F2F2F2] pt-[4vh]">
          <p className="font-[MuseoModerno] text-xl text-red-600">
            {error || "Item not found"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-5 p-3 bg-red-600 text-white rounded-md"
          >
            Go Back
          </button>
        </section>
      </>
    );
  }

  return (
    <>
      <Nav />
      <section className="w-full min-h-screen flex flex-col items-center bg-[#F2F2F2] pt-[4vh] gap-5 px-5">
        <div className="w-full px-10 fixed flex items-start justify-between mt-15">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="font-[MuseoModerno] font-bold text-2xl text-black hover:text-gray-600 cursor-pointer"
          >
            ← Go Back
          </button>

          <div className="bg-yellow-100 px-4 py-2 rounded-lg border border-yellow-400">
            <p className="font-[MuseoModerno] text-sm">
              <span className="font-bold">Owner View</span> - You are viewing
              this item as its owner
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
            <h2 className="font-[MuseoModerno] text-2xl font-bold mb-6">
              Edit Item
            </h2>

            <form onSubmit={handleSaveChanges} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-[MuseoModerno] font-medium mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editFormData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-[MuseoModerno] font-medium mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      id="category"
                      value={editFormData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md"
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home & Garden">Home & Garden</option>
                      <option value="Sports">Sports</option>
                      <option value="Collectibles">Collectibles</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-[MuseoModerno] font-medium mb-2">
                      Condition
                    </label>
                    <select
                      name="condition"
                      id="condition"
                      value={editFormData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md"
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-[MuseoModerno] font-medium mb-2">
                      Starting Bid ($)
                    </label>
                    <input
                      type="number"
                      id="startingBid"
                      name="startingBid"
                      value={editFormData.startingBid}
                      onChange={handleInputChange}
                      min="0.01"
                      step="0.01"
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-[MuseoModerno] font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={editFormData.description}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block font-[MuseoModerno] font-medium mb-2">
                      Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="w-full px-4 py-2 border rounded-md"
                    />

                    {previewImage && (
                      <div className="mt-2">
                        <p className="font-[MuseoModerno] text-sm mb-1">
                          Preview:
                        </p>
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-32 h-32 object-cover border rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex justify-center gap-8 mt-30">
            <div className="w-full md:w-[40%] h-[70vh] flex items-center justify-center rounded-2xl bg-gray-600">
              {item.image ? (
                <img
                  src={`https://res.cloudinary.com/dyfpxokoj/image/upload/${item.image}`}
                  alt={item.title}
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                <Carousel />
              )}
            </div>

            <div className="flex flex-col w-full md:w-[30%] min-h-[70vh] rounded-2xl border bg-white border-gray-300 shadow-2xl">
              <div className="w-full h-18 flex font-[MuseoModerno] text-xl font-bold items-center justify-between border-b-2 border-gray-300 px-5 py-3">
                <span>Product Details</span>
                <button
                  onClick={handleEditClick}
                  className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  disabled={item.status === "active" || item.status === "closed"}
                >
                  Edit Item
                </button>
              </div>
              <ul className="p-5 space-y-1 font-[MuseoModerno] text-l flex flex-col gap-5">
                <li>
                  <strong>Item ID:</strong> {item.id}
                </li>
                <li>
                  <strong>Item Name:</strong> {item.title}
                </li>
                <li>
                  <strong>Condition:</strong> {item.condition || "New"}
                </li>
                <li>
                  <strong>Category:</strong> {item.category || "Uncategorized"}
                </li>
                <li>
                  <strong>Description:</strong> {item.description}
                </li>
                <li>
                  <strong>Created:</strong> {formatDate(item.createdAt)}
                </li>
              </ul>
            </div>

            <div className="flex flex-col w-full md:w-[30%] min-h-[70vh] rounded-2xl bg-white font-[MuseoModerno] border border-gray-300 shadow-2xl">
              <div className="w-full h-18 flex font-[MuseoModerno] text-xl font-bold items-center border-b-2 border-gray-300 px-5 py-3">
                Auction Management
              </div>
              <div className="space-y-0.5 p-5 text-l flex flex-col gap-5">
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      item?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : item?.status === "closed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item?.status}
                  </span>
                </p>
                <p>
                  <strong>Starting Bid:</strong> ${item?.startingBid}{" "}
                  USD
                </p>
                <p>
                  <strong>Current Bid:</strong> $
                  {(item.currentBid || item.startingBid)} USD
                </p>
                <p>
                  <strong>No. of Bids:</strong> {item.bids?.length || 0}
                </p>

                <p>
                  <strong>Current bidder:</strong>{" "}
                  <span>{item.currentBidder || "No bids yet"}</span>
                </p>

                {item?.status === "active" && (
                  <div className="bg-green-100 border border-green-400 p-4 rounded-md">
                    <p className="text-green-800 mb-2">
                      {/* <strong>Time Remaining:</strong> {formatTimeRemaining(new Date(item.endTime).valueOf()-Date.now())} */}
                      <strong>Time Remaining:</strong> <Countdown date={new Date(item.endTime).valueOf()}/>
                    </p>
                    <div className="bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${item.endTime ? (((new Date(item.endTime).valueOf()-Date.now())|| 0) / 300000) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="pt-5">
                  {item?.status === "upcoming" && (
                    <div>
                      <button
                        onClick={handleStartAuction}
                        className="w-full py-3 font-bold rounded-md bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
                      >
                        Start Auction Now
                      </button>
                      <p className="text-xs text-gray-600 pt-2">
                        Starting the auction will set a 2-minute duration for bidding.
                      </p>
                    </div>
                  )}
                  {item?.status === "active" && (
                    <div className="bg-green-100 border border-green-400 p-4 rounded-md">
                      <p className="text-green-800">
                        Your auction is currently active. Bidders can place bids
                        until the 2-minute timer ends.
                      </p>
                      <button
                        onClick={() => navigate(`/room/${id}`)}
                        className="w-full py-2 mt-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
                      >
                        View Auction Room
                      </button>
                    </div>
                  )}
                  {item?.status === "ended" && (
                    <div className="bg-gray-100 border border-gray-400 p-4 rounded-md">
                      <p className="text-gray-800">
                        This auction has ended.{" "}
                        {item.currentBidder
                          ? `The winning bidder was ${item.currentBidder}.`
                          : "There were no bids on this item."}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 pt-4">
                    As the item owner, you can edit the item details until the
                    auction starts. Once the auction begins, no changes can be
                    made.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default OwnerProductDetail;



// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router";
// import Nav from "../components/Nav";
// import Carousel from "../components/Carousel";
// import { apiGetAuctionById, apiUpdateAuction } from "../services/auction";

// const OwnerProductDetail = () => {
//   const params = useParams();
//   const { id } = params;
//   const navigate = useNavigate();


//   // State variables
//   const [item, setItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isOwner, setIsOwner] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     startingBid: 0,
//     condition: "",
//     image: null,
//   });
//   const [previewImage, setPreviewImage] = useState(null);
//   const [auctionTimeReached, setAuctionTimeReached] = useState(false);

//   useEffect(() => {
//     const fetchItemDetails = async () => {
//       try {
//         setLoading(true);
//         if (!id) {
//           setError("No item ID provided");
//           setLoading(false);
//           return;
//         }

//         const response = await apiGetAuctionById(id);
//         console.log("response", response);

//         if (response.data) {
//           setItem(response.data);
//           setEditFormData({
//             title: response.data.title || "",
//             description: response.data.description || "",
//             category: response.data.category || "",
//             startingBid: response.data.startingBid || 0,
//             condition: response.data.condition || "New",
//           });

//           // Check if current user is the owner
//           const userId = localStorage.getItem("userId");
//           const isUserOwner = userId === response.data.id;
//           setIsOwner(isUserOwner);

//           // Check if auction start time has been reached
//           if (response.data.startTime) {
//             const now = new Date();
//             const startTime = new Date(response.data.startTime);
//             setAuctionTimeReached(now >= startTime);
//           }
//         } else {
//           setError("Item details not found");
//         }
//       } catch (err) {
//         console.error("Error fetching item details:", err);
//         setError("Failed to load item details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItemDetails();

//     // Set up interval to check if auction time has been reached (check every 15 seconds)
//     const intervalId = setInterval(() => {
//       if (item && item.endTime) {
//         const now = new Date();
//         const startTime = new Date(item.endTime);
//         setAuctionTimeReached(now >= startTime);
//       }
//     }, 15000);

//     return () => clearInterval(intervalId);
//   }, [id, navigate]);

//   // Modify the handleStartAuction function
// // const handleStartAuction = async () => {
// //   try {
// //     // Calculate the end time (e.g., 24 hours from now)
// //     const now = new Date();
// //     const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    
// //     // Update item status to active and set the endTime
// //     const updateResponse = await apiUpdateAuction(id, {
// //       isActive: true,
// //       startTime: now.toISOString(),
// //       endTime: endTime.toISOString()
// //     });

// //     if (updateResponse.data) {
// //       // Update local state
// //       setItem({
// //         ...item,
// //         isActive: true,
// //         startTime: now.toISOString(),
// //         endTime: endTime.toISOString()
// //       });
      
// //       // Navigate to auction room or refresh the page
// //       navigate(`/auction-room/${id}`);
// //     }
// //   } catch (error) {
// //     console.error("Error starting auction:", error);
// //   }
// // };


// // Modify handleStartAuction to emit a socket event
// const handleStartAuction = async () => {
//   try {
//     // Calculate the end time (e.g., 24 hours from now)
//     const now = new Date();
//     const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    
//     // Update item status to active and set the endTime
//     const updateResponse = await apiUpdateAuction(id, {
//       isActive: true,
//       startTime: now.toISOString(),
//       endTime: endTime.toISOString()
//     });

//     if (updateResponse.data) {
//       // Update local state
//       setItem({
//         ...item,
//         isActive: true,
//         startTime: now.toISOString(),
//         endTime: endTime.toISOString()
//       });
      
//       // Emit socket event that auction has started
//       if (socket) {
//         socket.emit("auctionStarted", {
//           auctionId: id,
//           title: item.title,
//           startTime: now.toISOString(),
//           endTime: endTime.toISOString()
//         });
        
//         // Join the auction room as the owner
//         socket.emit("joinAuction", id);
//       }
      
//       // Navigate to auction room
//       navigate(`/room/${id}`);
//     }
//   } catch (error) {
//     console.error("Error starting auction:", error);
//   }
// };
//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     // Reset form data to original values
//     if (item) {
//       setEditFormData({
//         title: item.title || "",
//         description: item.description || "",
//         category: item.category || "",
//         startingBid: item.startingBid || 0,
//         condition: item.condition || "New",
//       });
//       setPreviewImage(null);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;

//     if (type === "file") {
//       const file = e.target.files[0];
//       setEditFormData((prev) => ({
//         ...prev,
//         image: file,
//       }));

//       // Create preview URL for the image
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setPreviewImage(reader.result);
//         };
//         reader.readAsDataURL(file);
//       }
//     } else if (name === "startingBid") {
//       setEditFormData((prev) => ({
//         ...prev,
//         [name]: parseFloat(value),
//       }));
//     } else {
//       setEditFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSaveChanges = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       for (const key in editFormData) {
//         if (editFormData[key] !== null) {
//           formData.append(key, editFormData[key]);
//         }
//       }

//       const response = await apiUpdateAuction(id, formData);

//       if (response.data) {
//         setItem(response.data);
//         setIsEditing(false);
//         setPreviewImage(null);
//       }
//     } catch (error) {
//       console.error("Error updating item:", error);
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleString();
//   };


//   if (loading) {
//     return (
//       <>
//         <Nav />
//         <section className="w-full h-screen flex items-center justify-center bg-[#F2F2F2] pt-[4vh]">
//           <p className="font-[MuseoModerno] text-xl">Loading item details...</p>
//         </section>
//       </>
//     );
//   }

//   if (error || !item) {
//     return (
//       <>
//         <Nav />
//         <section className="w-full h-screen flex flex-col items-center justify-center bg-[#F2F2F2] pt-[4vh]">
//           <p className="font-[MuseoModerno] text-xl text-red-600">
//             {error || "Item not found"}
//           </p>
//           <button
//             onClick={() => navigate(-1)}
//             className="mt-5 p-3 bg-red-600 text-white rounded-md"
//           >
//             Go Back
//           </button>
//         </section>
//       </>
//     );
//   }

//   return (
//     <>
//       <Nav />
//       <section className="w-full min-h-screen flex flex-col items-center bg-[#F2F2F2] pt-[4vh] gap-5 px-5">
//         <div className="w-full px-10 fixed flex items-start justify-between mt-15">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="font-[MuseoModerno] font-bold text-2xl text-black hover:text-gray-600 cursor-pointer"
//           >
//             ← Go Back
//           </button>

//           <div className="bg-yellow-100 px-4 py-2 rounded-lg border border-yellow-400">
//             <p className="font-[MuseoModerno] text-sm">
//               <span className="font-bold">Owner View</span> - You are viewing
//               this item as its owner
//             </p>
//           </div>
//         </div>

//         {isEditing ? (
//           <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
//             <h2 className="font-[MuseoModerno] text-2xl font-bold mb-6">
//               Edit Item
//             </h2>

//             <form onSubmit={handleSaveChanges} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block font-[MuseoModerno] font-medium mb-2">
//                       Title
//                     </label>
//                     <input
//                       type="text"
//                       id="title"
//                       name="title"
//                       value={editFormData.title}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border rounded-md"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block font-[MuseoModerno] font-medium mb-2">
//                       Category
//                     </label>
//                     <select
//                       name="category"
//                       id="category"
//                       value={editFormData.category}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border rounded-md"
//                     >
//                       <option value="">Select Category</option>
//                       <option value="Electronics">Electronics</option>
//                       <option value="Fashion">Fashion</option>
//                       <option value="Home & Garden">Home & Garden</option>
//                       <option value="Sports">Sports</option>
//                       <option value="Collectibles">Collectibles</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block font-[MuseoModerno] font-medium mb-2">
//                       Condition
//                     </label>
//                     <select
//                       name="condition"
//                       id="condition"
//                       value={editFormData.condition}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border rounded-md"
//                     >
//                       <option value="New">New</option>
//                       <option value="Like New">Like New</option>
//                       <option value="Excellent">Excellent</option>
//                       <option value="Good">Good</option>
//                       <option value="Fair">Fair</option>
//                       <option value="Poor">Poor</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block font-[MuseoModerno] font-medium mb-2">
//                       Starting Bid ($)
//                     </label>
//                     <input
//                       type="number"
//                       id="startingBid"
//                       name="startingBid"
//                       value={editFormData.startingBid}
//                       onChange={handleInputChange}
//                       min="0.01"
//                       step="0.01"
//                       className="w-full px-4 py-2 border rounded-md"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block font-[MuseoModerno] font-medium mb-2">
//                       Description
//                     </label>
//                     <textarea
//                       name="description"
//                       id="description"
//                       value={editFormData.description}
//                       onChange={handleInputChange}
//                       rows="5"
//                       className="w-full px-4 py-2 border rounded-md"
//                     />
//                   </div>

//                   <div>
//                     <label className="block font-[MuseoModerno] font-medium mb-2">
//                       Image
//                     </label>
//                     <input
//                       type="file"
//                       name="image"
//                       id="image"
//                       onChange={handleInputChange}
//                       accept="image/*"
//                       className="w-full px-4 py-2 border rounded-md"
//                     />

//                     {previewImage && (
//                       <div className="mt-2">
//                         <p className="font-[MuseoModerno] text-sm mb-1">
//                           Preview:
//                         </p>
//                         <img
//                           src={previewImage}
//                           alt="Preview"
//                           className="w-32 h-32 object-cover border rounded-md"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-4">
//                 <button
//                   type="button"
//                   onClick={handleCancelEdit}
//                   className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         ) : (
//           <div className="flex justify-center gap-8 mt-30">
//             <div className="w-full md:w-[40%] h-[70vh] flex items-center justify-center rounded-2xl bg-gray-600">
//               {item.image ? (
//                 <img
//                   src={`https://res.cloudinary.com/dyfpxokoj/image/upload/${item.image}`}
//                   alt={item.title}
//                   className="w-full h-full object-contain rounded-2xl"
//                 />
//               ) : (
//                 <Carousel />
//               )}
//             </div>

//             <div className="flex flex-col w-full md:w-[30%] min-h-[70vh] rounded-2xl border bg-white border-gray-300 shadow-2xl">
//               <div className="w-full h-18 flex font-[MuseoModerno] text-xl font-bold items-center justify-between border-b-2 border-gray-300 px-5 py-3">
//                 <span>Product Details</span>
//                 <button
//                   onClick={handleEditClick}
//                   className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
//                 >
//                   Edit Item
//                 </button>
//               </div>
//               <ul className="p-5 space-y-1 font-[MuseoModerno] text-l flex flex-col gap-5">
//                 <li>
//                   <strong>Item ID:</strong> {item.id}
//                 </li>
//                 <li>
//                   <strong>Item Name:</strong> {item.title}
//                 </li>
//                 <li>
//                   <strong>Condition:</strong> {item.condition || "New"}
//                 </li>
//                 <li>
//                   <strong>Category:</strong> {item.category || "Uncategorized"}
//                 </li>
//                 <li>
//                   <strong>Description:</strong> {item.description}
//                 </li>
//                 <li>
//                   <strong>Created:</strong> {formatDate(item.createdAt)}
//                 </li>
//               </ul>
//             </div>

//             <div className="flex flex-col w-full md:w-[30%] min-h-[70vh] rounded-2xl bg-white font-[MuseoModerno] border border-gray-300 shadow-2xl">
//               <div className="w-full h-18 flex font-[MuseoModerno] text-xl font-bold items-center border-b-2 border-gray-300 px-5 py-3">
//                 Auction Management
//               </div>
//               <div className="space-y-0.5 p-5 text-l flex flex-col gap-5">
//                 <p>
//                   <strong>Status:</strong>{" "}
//                   <span
//                     className={`px-2 py-1 rounded-full text-sm ${
//                       item?.status === "active"
//                         ? "bg-green-100 text-green-800"
//                         : item?.status === "closed"
//                         ? "bg-red-100 text-red-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {item?.status}
//                   </span>
//                 </p>
//                 <p>
//                   <strong>Starting Bid:</strong> ${item?.startingBid}{" "}
//                   USD
//                 </p>
//                 <p>
//                   <strong>Current Bid:</strong> $
//                   {(item.currentBid || item.startingBid)} USD
//                 </p>
//                 <p>
//                   <strong>No. of Bids:</strong> {item.bids?.length || 0}
//                 </p>

//                 <p>
//                   <strong>Current bidder:</strong>{" "}
//                   <span>{item.currentBidder || "No bids yet"}</span>
//                 </p>

//                 <div className="pt-5">
//                   {item?.status === "upcoming" && (
//                     <button
//                       onClick={handleStartAuction}
//                       // Remove the disabled attribute
//                       className="w-full py-3 font-bold rounded-md bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
//                     >
//                       Start Auction Now
//                     </button>
//                   )}
//                   {item?.status === "active" && (
//                     <div className="bg-green-100 border border-green-400 p-4 rounded-md">
//                       <p className="text-green-800">
//                         Your auction is currently active. Bidders can place bids
//                         until the end time.
//                       </p>
//                       <button
//                         onClick={() => navigate(`/room/${id}`)}
//                         className="w-full py-2 mt-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
//                       >
//                         View Auction Room
//                       </button>
//                     </div>
//                   )}
//                   {item?.status === "closed" && (
//                     <div className="bg-gray-100 border border-gray-400 p-4 rounded-md">
//                       <p className="text-gray-800">
//                         This auction has ended.{" "}
//                         {item.currentBidder
//                           ? `The winning bidder was ${item.currentBidder}.`
//                           : "There were no bids on this item."}
//                       </p>
//                     </div>
//                   )}
//                   <p className="text-xs text-gray-600 pt-4">
//                     As the item owner, you can edit the item details until the
//                     auction starts. Once the auction begins, no changes can be
//                     made.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </section>
//     </>
//   );
// };

// export default OwnerProductDetail;