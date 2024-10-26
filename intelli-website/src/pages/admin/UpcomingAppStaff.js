import React, { useState, useEffect } from 'react';
import './UpcomingAppStaff.css';
import Sidebar from './Sidebar';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button
} from '@mui/material';

export default function UpcomingAppStaff() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/appointments`);
  
        if (!response.ok) {
          throw new Error("Error fetching appointments");
        }
        const data = await response.json();
        console.log("Fetched appointments data:", data);
  
        const appointmentsWithTherapists = await Promise.all(
          data.map(async (appointment) => {
            const appointmentDate = new Date(appointment.start_time);
            const formattedDate = appointmentDate.toLocaleDateString('en-CA'); // Check this formatting!
            const startTime = appointmentDate.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
            const endTime = new Date(appointment.end_time).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
            const selectedSchedule = `${startTime} - ${endTime}`;
  
            console.log("Formatted Date:", formattedDate);
            console.log("Selected Schedule:", selectedSchedule);
  
            const therapistsResponse = await fetch(
              `${process.env.REACT_BACKEND_API}/api/therapists-avail?selectedDate=${formattedDate}&selectedSchedule=${selectedSchedule}`,
              { credentials: 'include' }
            );
  
            if (!therapistsResponse.ok) {
              const errorData = await therapistsResponse.json();
              console.error("Error fetching therapists for appointment:", errorData.error || therapistsResponse.statusText);
              throw new Error("Error fetching therapists for appointment");
            }
            const therapistsData = await therapistsResponse.json();
            appointment.availableTherapist = therapistsData;
  
            return appointment;
          })
        );
  
        setAppointments(appointmentsWithTherapists);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, []);

const handleTherapistChange = (event, appointmentId) => {
  // 1. Get the selected therapist ID from the event
  const selectedTherapistId = event.target.value; 

  setAppointments(prevAppointments => {
    return prevAppointments.map(appointment => {
      if (appointment._id === appointmentId) {
        // Update the therapistId for the selected appointment
        return { ...appointment, therapist_id: selectedTherapistId }; 
      } else {
        return appointment;
      }
    });
  });
};

const handleConfirmAppointment = async (appointmentId) => {
  const therapistId = selectedTherapist[appointmentId];
  try {
    // Get therapistId from selectedTherapist state
    const therapistId = selectedTherapist[appointmentId]; 

    if (!therapistId) {
      // Handle the case where no therapist is selected
      alert("Please select a therapist before confirming."); 
      return;
    }

    const response = await fetch(
      `${process.env.REACT_BACKEND_API}/api/appointments/${appointmentId}/confirm`,
      {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ therapist_id: therapistId }) 
      }
    );

    if (response.ok) {
      const updatedAppointment = await response.json(); 

      // Update the appointments state using the updated data from the server
      setAppointments((prevAppointments) => {
        const updatedAppointments = prevAppointments.map(
          (appointment) =>
            appointment._id === appointmentId
              ? updatedAppointment // Use the updated appointment from the server
              : appointment
        );
        return updatedAppointments;
      });

      alert("Appointment confirmed!");
    } else {
      // Handle error (e.g., display an error message)
      try {
        const errorData = await response.json();
        console.error(
          "Error confirming appointment:",
          errorData.error || response.statusText
        );
      } catch (parseError) {
        console.error(
          "Error parsing server response:",
          parseError
        );
        alert(
          "Unexpected response from the server. Please try again later."
        );
      }
    }

  } catch (error) {
    console.error("Error confirming appointment:", error);
    alert("Network error. Please check your connection.");
  }
  console.log("Confirm button clicked!");
console.log("Appointment ID:", appointmentId);
console.log("Therapist ID:", therapistId);
};

    const handleDeleteAppointment = async (appointmentId) => {
        if (
            window.confirm(
                "Are you sure you want to delete this appointment?"
            )
        ) {
            try {
                const response = await fetch(
                    `${process.env.REACT_BACKEND_API}/api/appointments/${appointmentId}`,
                    {
                        method: "DELETE",
                    }
                );

                if (response.ok) {
                    setAppointments((prevAppointments) =>
                        prevAppointments.filter(
                            (appointment) => appointment._id !== appointmentId
                        )
                    );
                } else {
                    const errorData = await response.json();
                    console.error(
                        "Error deleting appointment:",
                        errorData.error || response.statusText
                    );
                }
            } catch (error) {
                console.error("Error deleting appointment:", error);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: '30px',
          marginLeft: '280px', // Align with sidebar
          transition: 'margin 0.3s ease',
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px', color: '#2d848b', fontWeight: 'bolder' }}
        >
          Upcoming Appointments
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: 3 }}>
          <Table aria-label="appointments table" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f4f4f4' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#3F4662' }}>Appointment Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#3F4662' }}>Assigned Therapist</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#3F4662' }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#3F4662' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#3F4662' }}>Start Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#3F4662' }}>End Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#3F4662' }}>Status</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading appointments...
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {error}
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                !error &&
                appointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                  <TableCell>{appointment.appointment_type}</TableCell>

                  {/* Therapist Selection/Display */}
                  <TableCell>
                  {appointment.appointment_status === 'Confirmed' && appointment.therapist_id ? (
    // Show the therapist's ID if the appointment is confirmed and therapist_id exists
    appointment.availableTherapist &&  // Check if availableTherapist is an array
    appointment.availableTherapist.find(therapist => therapist._id === appointment.therapist_id)?.therapist_name // Use therapist._id for comparison
  ) : (
    // Otherwise, show the therapist selection dropdown
    appointment.availableTherapist ? (
      <select 
        value={selectedTherapist[appointment._id] || ""}
        onChange={(e) => { 
          setSelectedTherapist(prevState => ({
            ...prevState,
            [appointment._id]: e.target.value 
          }));
          handleTherapistChange(e, appointment._id);
        }}
      >
        <option key="default-therapist" value="">Select Therapist</option> 
        {appointment.availableTherapist.map((therapist) => (
          <option key={therapist.id} value={therapist.id}>
            {therapist.therapist_name}
          </option>
        ))}
      </select>
    ) : (
      <span>Loading therapists...</span> 
    )
  )}
</TableCell>
                    <TableCell>{appointment.patient_name}</TableCell>
                    <TableCell>
                    {(() => {
                        const appointmentDate = new Date(appointment.start_time);
                        const formattedDate = appointmentDate.toLocaleDateString('en-US');
                        return formattedDate;
                    })()}
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.start_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.end_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>{appointment.appointment_status}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ marginRight: 1, backgroundColor: '#2D848B', color: '#fff'  }}
                        onClick={() => handleConfirmAppointment(appointment._id)}
                      >
                        Confirm
                      </Button>

                      <Button
                        aria-label="delete"
                        color="error"
                        sx={{ marginRight: 1,
                          backgroundColor: '#e53935',
                          color: '#fff',
                        '&:hover': { backgroundColor: '#d32f2f' }, }}
                        onClick={() => handleDeleteAppointment(appointment._id)}
                        >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}