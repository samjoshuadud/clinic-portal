// SuccessPopup.jsx
import React from 'react';

const SuccessPopup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold text-green-600">{message}</h2>
        <button 
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}; // useless ass

export default SuccessPopup;
