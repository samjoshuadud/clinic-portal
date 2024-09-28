import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';

const localizer = momentLocalizer(moment);

function AppointmentCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(''); // State to hold error messages
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [slotInfo, setSlotInfo] = useState(null); // Add this state to hold slotInfo
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/appointments');
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      setError('Error fetching appointments');
    }
  };

  const handleCreateAppointment = async () => {
    if (!appointmentTitle) {
      setError('Appointment title is required');
      return;
    }

    try {
      const newAppointment = {
        title: appointmentTitle,
        start: slotInfo.start,
        end: slotInfo.end,
      };
      const response = await axios.post('http://localhost:5000/appointments', newAppointment);
      setAppointments([...appointments, response.data]);
      setError('');
      setShowCreateModal(false);
    } catch (error) {
      setError('Error creating appointment');
    }
  };

  const handleCancelAppointment = async () => {
    try {
      await axios.delete(`http://localhost:5000/appointments/${selectedAppointment.id}`);
      setAppointments(appointments.filter((apt) => apt.id !== selectedAppointment.id));
      setError('');
      setShowCancelModal(false);
    } catch (error) {
      setError('Error canceling appointment');
    }
  };

  const handleSelectSlot = async (slotInfo) => {
    setSlotInfo(slotInfo);
    setShowCreateModal(true);
  };

  const handleSelectEvent = async (event) => {
    setSelectedAppointment(event);
    setShowCancelModal(true);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-[#3d264b] text-center">
          Appointment Calendar
        </h2>
        {error && <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">{error}</div>} {/* Error message display */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <Calendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            className="h-[calc(100vh-12rem)]"
            views={['month', 'week', 'day']}
            formats={{
              dayFormat: 'ddd D',
              dayRangeHeaderFormat: ({ start, end }) =>
                `${moment(start).format('MMM D')} - ${moment(end).format('MMM D, YYYY')}`,
            }}
            components={{
              toolbar: CustomToolbar,
              event: CustomEvent,
            }}
          />

          {showCreateModal && (
            <Modal
              isOpen={showCreateModal}
              onRequestClose={() => setShowCreateModal(false)}
              className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6"
              overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
            >
              <div className="bg-white flex flex-col justify-center items-center h-full p-6">
                <h2 className="text-2xl font-bold text-center mb-4">Create Appointment</h2>
                <input
                  type="text"
                  value={appointmentTitle}
                  onChange={(e) => setAppointmentTitle(e.target.value)}
                  placeholder="Enter appointment title"
                  className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                />
                {error && (
                  <p className="text-red-500 text-center mb-2">
                    {error}
                  </p>
                )}
                <div className="flex justify-center">
                <button
                    onClick={handleCreateAppointment}
                    className="bg-[#61387a] text-white rounded-lg px-4 py-2 hover:bg-[#452a57] transition"
                  >
                    Create Appointment
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="bg-gray-200 text-gray-600 rounded-lg px-4 py-2 hover:bg-gray-300 transition ml-4"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {showCancelModal && (
            <Modal
              isOpen={showCancelModal}
              onRequestClose={() => setShowCancelModal(false)}
              className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6"
              overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
            >
              <div className="bg-white flex flex-col justify-center items-center h-full p-6">
                <h2 className="text-2xl font-bold text-center mb-4">Cancel Appointment</h2>
                <p className="text-lg text-center mb-4">
                  Are you sure you want to cancel the appointment: {selectedAppointment.title}?
                </p>
                {error && (
                  <p className="text-red-500 text-center mb-2">
                    {error}
                  </p>
                )}
                <div className="flex justify-center">
                  <button
                    onClick={handleCancelAppointment}
                    className="bg-[#61387a] text-white rounded-lg px-4 py-2 hover:bg-[#352042] transition"
                  >
                    Cancel Appointment
                  </button>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="bg-gray-200 text-gray-600 rounded-lg px-4 py-2 hover:bg-gray-300 transition ml-4"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

const CustomToolbar = ({ label, onNavigate, onView, view }) => (
  <div className="flex justify-between items-center p-4 bg-[#61387a] text-white">
    <div> 
    <button onClick={() => onNavigate('PREV')} className="mr-2 px-3 py-1 rounded hover:bg-indigo-600 transition">
        &lt;
      </button>
      <button onClick={() => onNavigate('NEXT')} className="px-3 py-1 rounded hover:bg-indigo-600 transition">
        &gt;
      </button>
    </div>
    <h3 className="text-xl font-semibold">{label}</h3>
    <div>
      <button
        onClick={() => onView('month')}
        className={`mr-2 px-3 py-1 rounded transition ${view === 'month' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}
      >
        Month
      </button>
      <button
        onClick={() => onView('week')}
        className={`mr-2 px-3 py-1 rounded transition ${view === 'week' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}
      >
        Week
      </button>
      <button
        onClick={() => onView('day')}
        className={`px-3 py-1 rounded transition ${view === 'day' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}
      >
        Day
      </button>
    </div>
  </div>
);

const CustomEvent = ({ event }) => (
  <div className="bg-indigo-100 text-indigo-800 p-1 rounded text-sm overflow-hidden">
    {event.title}
  </div>
);

export default AppointmentCalendar;