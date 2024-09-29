import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

const localizer = momentLocalizer(moment);

function AppointmentCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [slotInfo, setSlotInfo] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get('/api/appointments');
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setAppointments(response.data.appointments.map(apt => ({
          ...apt,
          start: new Date(apt.start),
          end: new Date(apt.end)
        })));
      }
    } catch (error) {
      setError('Error fetching appointments');
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCreateAppointment = async () => {
    if (!appointmentTitle) {
      setError('Please Input Title!');
      return;
    }
  
    try {
      const startTime = new Date(slotInfo.start);
      startTime.setHours(startTime.getHours() + 24);  // manual add to
  
      const endTime = new Date(slotInfo.end);
      endTime.setHours(endTime.getHours() + 24);  // manual add to
  
      const newAppointment = {
        title: appointmentTitle,
        start: startTime,
        end: endTime,
      };
  
      const response = await axios.post('/api/appointments', newAppointment);
  
      const createdAppointment = {
        ...response.data,
        start: new Date(response.data.start),
        end: new Date(response.data.end),
      };
  
      setAppointments(prevAppointments => [...prevAppointments, createdAppointment]);
  
      setError('');
      setShowCreateModal(false);
      setAppointmentTitle('');
  
    } catch (error) {
      setError('Error creating appointment');
    }
  };

  const handleCancelAppointment = async () => {
    try {
      await axios.delete(`/api/appointments/${selectedAppointment.id}`);
  
      // Remove the cancelled appointment from the state
      setAppointments(prevAppointments => 
        prevAppointments.filter((apt) => apt.id !== selectedAppointment.id)
      );
  
      // Close modal and reset states
      setError('');
      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      setError('Error canceling appointment');
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setSlotInfo(slotInfo);
    setShowCreateModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedAppointment(event);
    setShowCancelModal(true);
  };

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000, 
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '500px',
      width: '90%',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 999, 
    },
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-[#3d264b] text-center">
          Appointment Calendar
        </h2>
        {error && <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">{error}</div>}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <Calendar
           key={appointments.length}
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
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onRequestClose={() => setShowCreateModal(false)}
        style={modalStyles}
        contentLabel="Create Appointment Modal"
      >
        <div className="flex flex-col justify-center items-center">
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
              onClick={() => {
                setShowCreateModal(false);
                setAppointmentTitle('');
                setError('');
              }}
              className="bg-gray-200 text-gray-600 rounded-lg px-4 py-2 hover:bg-gray-300 transition ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCancelModal}
        onRequestClose={() => setShowCancelModal(false)}
        style={modalStyles}
        contentLabel="Cancel Appointment Modal"
      >
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-center mb-4">Cancel Appointment</h2>
          <p className="text-lg text-center mb-4">
            Are you sure you want to cancel the appointment: {selectedAppointment?.title}?
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
              onClick={() => {
                setShowCancelModal(false);
                setSelectedAppointment(null);
                setError('');
              }}
              className="bg-gray-200 text-gray-600 rounded-lg px-4 py-2 hover:bg-gray-300 transition ml-4"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
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