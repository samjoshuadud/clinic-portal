// File: src/components/PatientRecords.js
import React from 'react';

function PatientRecords() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-purple-600">
            <h2 className="text-3xl font-extrabold text-white text-center">Patient Records</h2>
          </div>
          <div className="p-6 sm:p-10">
            {/* Add content for patient records here */}
            <p>This is where you can view patient records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientRecords;
