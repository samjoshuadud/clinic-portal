// File: src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    
    <div>
      
      <h2 className="text-2xl font-bold mb-6 text-white text-center"><span className="text-[#FFFF8D]">Welcome</span> to the Clinic Portal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Patient Management"
          description="View and manage patient records"
          link="/patients"
        />
        <DashboardCard
          title ="Appointments"
          description="Schedule and manage appointments"
          link="/appointments"
          

        />
      </div>
      
    </div>
  );
}

function DashboardCard({ title, description, link }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-semibold mb-2 text-[#61387a]">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link to={link} className="text-[#61387a] hover:text-[#3f284e] font-medium">
        Go to {title} →
      </Link>
    </div>
  );
}

export default Dashboard;