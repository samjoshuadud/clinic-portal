import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5b3274] to-[#472c58] p-8 flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-12 text-white text-center">
        Welcome to the <span className="text-[#FFFF8D]">Clinic Portal</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        <DashboardCard
          title="Patient Management"
          description="View and manage patient records"
          link="/patients"
          icon={Users}
        />
        <DashboardCard
          title="Appointments"
          description="Schedule and manage appointments"
          link="/appointments"
          icon={Calendar}
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, link, icon: Icon }) {
  return (
    <Link to={link} className="block">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 h-full flex flex-col justify-between border border-white border-opacity-20">
        <div>
          <div className="flex items-center mb-4">
            <Icon className="text-[#FFFF8D] mr-3" size={28} />
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
          </div>
          <p className="text-gray-200 mb-6 text-lg">{description}</p>
        </div>
        <span className="text-[#FFFF8D] hover:text-white font-medium inline-flex items-center text-lg">
          Go to {title}
          <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default Dashboard;