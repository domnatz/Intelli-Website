import React, { useState, useEffect } from 'react';
import './UpcomingAppStaff.css';
import Sidebar from './Sidebar';
import dayjs from 'dayjs'; 

export default function UpcomingAppStaff() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/appointments'); 
        if (!response.ok) {
            throw new Error('Error fetching appointments'); 
          }
  
          const data = await response.json();
          console.log("Fetched appointments data:", data);
  
          // No filtering needed - display all appointments
          setAppointments(data); 
        } catch (err) {
          console.error('Error fetching appointments:', err);
          setError('Failed to fetch appointments. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchAppointments();
    }, []);
  
    return (
      <div className="upcoming-app-staff">
        <Sidebar />
        <div className="upcoming-app-content">
          <h6 className="therapist-schedule-title">Upcoming Appointments</h6>
          <div className="appointments-container">
            {loading && <p>Loading appointments...</p>} 
            {error && <p>{error}</p>} 
  
            {/* Render the table if data is loaded and there's no error */}
            {!loading && !error && ( 
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Appointment Type</th>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appointment => (
                    <tr key={appointment._id}>
                      <td>{appointment.appointment_type}</td> 
  
                      <td>{appointment.patient_name}</td> 
                      <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                      <td>{new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{new Date(appointment.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{appointment.appointment_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
  );
}