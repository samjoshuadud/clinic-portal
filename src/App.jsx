// File: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientProfile from './components/PatientProfile';
import AppointmentCalendar from './components/AppointmentCalendar';
// import Login from './hidden/Login';
import './index.css'; 
// import PatientRecords from './components/PatientRecords';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-[#61387a] h-3/4 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="https://www.umak.edu.ph/wp-content/uploads/2022/09/IOP-logo-300x300.png" 
            alt="UMak Logo" 
            className="h-20 w-20 mr-4" // Adjust height and width as needed
          />
          <h1 className="text-3xl font-poppins font-bold">Clinic Portal</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-[#FFFF8D] font-poppins hover:text-teal-200 transition duration-150">Dashboard</Link>
            </li>
            <li>
              <Link to="/patients" className="text-[#FFFF8D] font-poppins hover:text-teal-200 transition duration-150">Patients</Link>
            </li>
            <li>
              <Link to="/appointments" className="text-[#FFFF8D] font-poppins hover:text-teal-200 transition duration-150">Appointments</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
        <main className="flex-grow container mx-auto mt-8 px-4">
          <div className="bg-[#5F337A] rounded-lg shadow-md p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patient/:id" element={<PatientProfile />} />
              <Route path="/appointments" element={<AppointmentCalendar />} />
            </Routes>
          </div>
        </main>
        <footer className="bg-[#61387a] text-white mt-8">
          <div className="container mx-auto px-4 py-4 text-center ">
          © <span className="text-[#FFFF8D]">2024 UMak </span>Clinic Portal. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
