import React, { useState, useEffect } from 'react';
import './TherapistSchedule.css';
//import { Button } from '@mui/material';
import Sidebar from './Sidebar';
/* 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';  */
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment)

export default function TherapistSchedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markedDates, setMarkedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

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

        // Extract dates from the fetched data and format them
        const dates = data.map((schedule) => 
          new Date(schedule.start_time).toLocaleDateString()
        );
        setMarkedDates(dates);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  const bookedDate = scheduleData.map((schedule) => ({
    title: schedule.therapist_id?.therapist_name || 'Unknown', // Display therapist name
    start: moment(schedule.start_time).toDate(),
    end: moment(schedule.end_time).toDate(),
    scheduleId: schedule._id,
  }));

  const handleDeleteSchedule = async (event) => {
    const scheduleId = event.scheduleId; 

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
          <div className="therapist-schedule-calendar">
            <Calendar localizer={localizer}
              events={bookedDate}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              style={{ height: 800 }}
              onSelectEvent={handleDeleteSchedule}
              className="schedule-calendar"
            />
          </div>
        )}
      </div>
    </div>
  </div>
);
}