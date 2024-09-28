// File: src/components/PatientProfile.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // State for success popup
  const [showDetails, setShowDetails] = useState(false);
  const [showSurgeryDetails, setShowSurgeryDetails] = useState(false); // State to manage hidden input
  
  const [loading, setLoading] = useState(false);

  const toggleDetails = async () => {
    setShowDetails(!showDetails);
    try {
      const medicalRecordsText = `${patient.diagnosis} ${patient.surgicalHistory} ${patient.surgeryDetails} ${patient.allergies} ${patient.medications}`;
      const geminiApiUrl = 'https://generativelanguage.googleapis.com';
      const geminiApiKey = 'AIzaSyCcK-lSk9xQN-KhhDDE4RQvvoeQh8G0RC8';
  
      const response = await axios.post(geminiApiUrl, {
        text: medicalRecordsText,
      }, {
        headers: {
          'Authorization': `Bearer ${geminiApiKey}`,
        },
      });
      const summary = response.data.summary;
      console.log(summary);
      // You can also update the state with the summary here
      setSummary(summary);
    } catch (error) {
      console.error(error);
    }
  }; // TRY LATER IF MATAPOS

  useEffect(() => {
    fetchPatient(id);
  }, [id]);

  const fetchPatient = async (patientId) => {
    try {
      const response = await axios.get(`http://localhost:5000/patients/${patientId}`);
      const patientData = {
        id: response.data.id,
        employeeNumber: response.data.employee_number,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        birthDate: response.data.birth_date,
        gender: response.data.gender,
        email: response.data.email,
        houseNum: response.data.house_num,
        street: response.data.street,
        barangay: response.data.barangay,
        city: response.data.city,
        image: response.data.image,
        activeness: response.data.activeness,
        surgicalHistory: response.data.surgicalHistory || '', // Surgical history default
        surgeryDetails: response.data.surgeryDetails || '',  
        diagnosis: response.data.diagnosis || '',
        medications: response.data.medications || '',
        allergies: response.data.allergies || '',
        height: response.data.height || '',
        weight: response.data.weight || '',

      };
      setPatient(patientData);
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError('Error fetching patient details. Please try again later.');
    }
  };

  

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
    if (name === 'surgicalHistory') {
      setShowSurgeryDetails(value === 'Yes');
      if (value === 'No') {
        setPatient({ ...patient, surgeryDetails: 'No Surgery' });
      } else if (value === 'Yes') {
        setPatient({ ...patient, surgeryDetails: '' });
      }
    }
  

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/patients/${patient.id}`, {
        employee_number: patient.employeeNumber,
        first_name: patient.firstName,
        last_name: patient.lastName,
        birth_date: patient.birthDate,
        gender: patient.gender,
        email: patient.email,
        house_num: patient.houseNum,
        street: patient.street,
        barangay: patient.barangay,
        city: patient.city,
        activeness: patient.activeness,
        surgicalHistory: patient.surgicalHistory,
        surgeryDetails: patient.surgeryDetails,
        weight: patient.weight,
        height: patient.height,
        diagnosis: patient.diagnosis,
        allergies: patient.allergies,
        medications: patient.medications,
      });
  
      if (response.status === 200) {
        setIsEditing(false);
        fetchPatient(patient.id); // Refresh the patient data
        setSuccess(true); // Show the success popup
      } else {
        setError('Failed to update patient. Please try again.');
      }
    } catch (err) {
      console.error('Error updating patient:', err);
      setError(`Error updating patient: ${err.message}. Please try again later.`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/patients/${patient.id}`);
      if (response.status === 200) {
        // Navigate back to the patient list page
        window.location.href = '/patients';
      } else {
        setError('Failed to delete patient. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError(`Error deleting patient: ${err.message}. Please try again later.`);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!patient) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Popup */}
        {success && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all">
              <h2 className="text-2xl font-bold text-bg-[#5F337A] mb-4">Patient Updated Successfully!</h2>
              <button
                onClick={() => setSuccess(false)}
                className="w-full px-4 py-2 bg-[#5F337A] text-white rounded-md hover:bg-black transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="px-6 py-8 bg-[#5F337A]">
            <h2 className="text-3xl font-extrabold text-white text-center"><span className="text-[#FFFF8D]">Patient</span> Profile</h2>
          </div>

          <div className="p-6 sm:p-10">
            {isEditing ? (
              <form onSubmit={(e) => { handleSubmit(e); setSuccess(true); }} className="space-y-6">
                <h2 className="text-lg font-semibold text-center text-[#452a55]">Patient Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "First Name", name: "firstName", type: "text" },
                    { label: "Last Name", name: "lastName", type: "text" },
                    { label: "Employee Number", name: "employeeNumber", type: "text" },
                    { label: "Birth Date", name: "birthDate", type: "date" },
                    { label: "Gender", name: "gender", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "House Number", name: "houseNum", type: "text" },
                    { label: "Street", name: "street", type: "text" },
                    { label: "Barangay", name: "barangay", type: "text" },
                    { label: "City", name: "city", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        id={name}
                        value={patient[name]}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="activeness" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="activeness"
                      name="activeness"
                      value={patient.activeness}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>
                </div>
                 <div></div>
                <h2 className="text-lg font-semibold text-center text-[#4b2e5e]">Medical History</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Height", name: "height", type: "text" },
                  { label: "Weight", name: "weight", type: "text" },
                  { label: "Previous Diagnosis", name: "diagnosis", type: "text" },
                  { label: "Surgical History", name: "surgicalHistory", type: "select" },
                  { label: "Allergies", name: "allergies", type: "text" },
                  { label: "Medications", name: "medications", type: "text" },
                ].map(({ label, name, type }) => (
                  <div key={name}>
                  <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  {type === "select" ? (
                   <div>
                   <select
                     name="surgicalHistory"
                     id="surgicalHistory"
                     value={patient.surgicalHistory}
                     onChange={handleInputChange}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                   >
                     <option value="None">No</option>
                     <option value="Yes">Yes</option>
                   </select>
                 </div>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      id={name}
                      value={patient[name]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  )}
                </div>
                ))}
              </div>

              {patient.surgicalHistory === "Yes" && (
            <div>
              <label htmlFor="surgeryDetails" className="block text-sm font-medium text-gray-700">
                Please specify the type of surgery
              </label>
              <input
                type="text"
                name="surgeryDetails"
                id="surgeryDetails"
                value={patient.surgeryDetails}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          )}
                <div className="flex justify-end space-x-4">


                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#61387a] hover:bg-[#492c5a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#61387a]"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col items-center">
                  <img
                    src={patient.image}
                    alt={`${patient.firstName} ${patient.lastName}`}
                    className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                  />
                  <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-[#61387a] font-medium">{patient.employeeNumber}</p>
                </div>

                <div className="bg-gray-50 rounded-xl shadow-inner p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "Birth Date", value: patient.birthDate },
                    { label: "Gender", value: patient.gender },
                    { label: "Email", value: patient.email },
                    { label: "House Number", value: patient.houseNum },
                    { label: "Street", value: patient.street },
                    { label: "Barangay", value: patient.barangay },
                    { label: "City", value: patient.city },
                    { label: "Status", value: patient.activeness },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="mt-1 text-lg font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-4">
          <button onClick={toggleDetails}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d={showDetails 
                  ? "M5.293 12.707a1 1 0 011.414 0L10 9.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z"
                  : "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"}
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

               {/* Additional Details Section */}
               {showDetails && (
          <div className="bg-gray-50 rounded-xl shadow-inner p-6 mt-4">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           {/* Error Here  */}
            {[ 
              { label: "Height", value: patient.height },
              { label: "Weight", value: patient.weight },
              { label: "Previous Diagnosis", value: patient.diagnosis },
              { label: "Surgical History", value: patient.surgicalHistory },
              patient.surgicalHistory === 'Yes' ? { label: "Surgical Details", value: patient.surgeryDetails } : null,
              { label: "Allergies", value: patient.allergies },
              { label: "Medications", value: patient.medications },
            ].filter(Boolean).map(({ label, value }) => (
              <div key={label} className="flex flex-col">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="mt-1 text-lg font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
          </div>
        )}

                <div className="flex justify-between pt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#61387a] hover:bg-[#472c58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c305e]"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default PatientProfile;
