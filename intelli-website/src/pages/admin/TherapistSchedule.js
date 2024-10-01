import React, { useState, useEffect } from 'react';
import './TherapistSchedule.css';
import Sidebar from './Sidebar';

export default function TherapistSchedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/therapist-schedule`); 
        console.log('Response:', response);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText || response.statusText}`);
        }

        const data = await response.json();
        console.log('Data:', data);
        setScheduleData(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
        // Confirmation dialog
        try {
            const response = await fetch(
                `${process.env.REACT_BACKEND_API}/api/schedules/${scheduleId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                // Update the scheduleData state to remove the deleted schedule
                setScheduleData((prevScheduleData) =>
                    prevScheduleData.filter(
                        (schedule) => schedule._id !== scheduleId
                    )
                );
            } else {
                // Handle error (e.g., display an error message)
                const errorData = await response.json();
                console.error(
                    "Error deleting schedule:",
                    errorData.error || response.statusText
                );
            }
        } catch (error) {
            console.error("Error deleting schedule:", error);
        }
    }
};


return (
  <div className="therapist-schedule-layout">
    <Sidebar />
    <div className="therapist-schedule-content">
      <h6 className="therapist-schedule-title">Therapist Schedule</h6>
      <div className="therapist-schedule-container">

        {error && <div className="error-message">{error}</div>}
        {isLoading && <div className="loading-indicator">Loading...</div>}

        {!isLoading && !error && (
          <table className="therapist-schedule-table">
            <thead>
              <tr>
                <th>Therapist Name</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((schedule) => (
                <tr key={schedule._id}>
                  <td>{schedule.therapist_id?.therapist_name || 'Unknown'}</td>
                  <td>{new Date(schedule.start_time).toLocaleDateString()}</td>
                  <td>{new Date(schedule.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{new Date(schedule.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    <button onClick={() => handleDeleteSchedule(schedule._id)}>Delete</button>
                  </td>
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