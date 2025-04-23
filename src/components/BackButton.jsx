import React from "react";

const BackButton = () => {
  return (
    <>
      <div className="w-full px-10 flex items-start ">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="font-[MuseoModerno] font-bold text-2xl text-black hover:text-red-600 cursor-pointer"
        >
          ← Go Back
        </button>
      </div>
    </>
  );
};

export default BackButton;
