import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;


function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    employee_number: '',
    birth_date: '',
    gender: '',
    email: '',
    house_num: '',
    street: '',
    barangay: '',
    city: '',
    activeness: '',
    image: null,
  });

  useEffect(() => {
    console.log("Component mounted, calling fetchPatients");
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    console.log("fetchPatients function called");
    try {
      console.log("Making API request");
      const response = await axios.get(`${apiUrl}/api/patients`);
      console.log('Raw API response:', response);
      console.log('API response data:', response.data);
      console.log('Is response.data an array?', Array.isArray(response.data));

      if (Array.isArray(response.data)) {
        setPatients(response.data);
      } else if (response.data.message && response.data.message.includes('No patients found')) {
        setPatients([]);
        setError('empty');
      } else {
        console.error('Unexpected data structure:', response.data);
        setError('Unexpected data structure received from server.');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      if (err.response && err.response.status === 404) {
        setError('empty');
      } else {
        setError('Error fetching patients. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPatient((prevPatient) => ({
        ...prevPatient,
        image: file, // Save the file object for upload
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewPatient((prev) => ({ ...prev, image: file }));
  };

  const handleAddPatient = async () => {
    const formData = new FormData();
    formData.append('first_name', newPatient.first_name);
    formData.append('last_name', newPatient.last_name);
    formData.append('employee_number', newPatient.employee_number);
    formData.append('birth_date', newPatient.birth_date);
    formData.append('gender', newPatient.gender);
    formData.append('email', newPatient.email);
    formData.append('house_num', newPatient.house_num);
    formData.append('street', newPatient.street);
    formData.append('barangay', newPatient.barangay);
    formData.append('city', newPatient.city);
    formData.append('activeness', newPatient.activeness);
    if (newPatient.image) {
      formData.append('image', newPatient.image); // Append the file
    }

    try {
      const response = await axios.post(`${apiUrl}/api/patients`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Patient added successfully:', response.data);
      setIsModalOpen(false); // Close modal after adding patient
      fetchPatients(); // Update the patients list after adding a new patient
      setNewPatient({
        first_name: '',
        last_name: '',
        email: '',
        birth_date: '',
        image: null,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#492c5a]">Patient List</h2>
      
      {/* Button to Open Modal */}
      <button 
        className="mb-6 w-full bg-[#61387a] text-white py-2 px-4 rounded hover:bg-[#4a2d5c] transition duration-300 flex items-center justify-center"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Patient
      </button>
  
      {/* Modal for Adding New Patient */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text=[#61387a]">Add New Patient</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-[#61387a] transition-colors duration-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={newPatient.first_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#61387a]"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={newPatient.last_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#61387a]"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newPatient.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#61387a]"
              required
            />
            <input
              type="date"
              name="birth_date"
              value={newPatient.birth_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#61387a]"
              required
            />
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#61387a]"
              accept="image/*"
              required
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddPatient}
                className="bg-[#61387a] text-white py-2 px-4 rounded hover:bg-[#412950] transition duration-300"
              >
                Add Patients
              </button>
            </div>
          </div>
        </div>
      )}
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : error === 'empty' ? (
          <div className="col-span-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">No Patients Found</h3>
            <p className="text-gray-600 mb-6 text-center">The database is currently empty. Please add patients to get started.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition duration-300"
            >
              Add New Patient
            </button>
          </div>
        ) : error ? (
          <div className="col-span-full text-red-500 text-center py-8">{error}</div>
        ) : patients.length > 0 ? (
          patients.map((patient) => (
            <div key={patient.id} className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
              <img
                src={patient.image || 'https://upload.wikimedia.org/wikipedia/en/b/b2/University_of_Makati_logo.png'}
                alt={`${patient.first_name} ${patient.last_name}'s avatar`}
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{`${patient.first_name} ${patient.last_name}`}</h3>
              <Link
                to={`/patient/${patient.id}`}
                className="bg-[#61387a] text-white py-2 px-4 rounded hover:bg-[#4b2e5e] transition duration-300"
              >
                More Information
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">No patient data available</div>
        )}
      </div>
    </div>
  );
  
}

export default PatientList;
