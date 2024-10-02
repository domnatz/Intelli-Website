import React, { useState, useEffect } from "react";
import "./UpcomingAppStaff.css";
import Sidebar from "./Sidebar";
import { Button } from '@mui/material';
export default function UpcomingAppStaff() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_BACKEND_API}/api/appointments`
                );
                if (!response.ok) {
                    throw new Error("Error fetching appointments");
                }
                const data = await response.json();
                console.log("Fetched appointments data:", data);

                // No filtering needed - display all appointments
                setAppointments(data);
            } catch (err) {
                console.error("Error fetching appointments:", err);
                setError(
                    "Failed to fetch appointments. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleConfirmAppointment = async (appointmentId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_BACKEND_API}/api/appointments/${appointmentId}/confirm`,
                {
                    method: "PUT",
                }
            );
    
            if (response.ok) {
                const updatedAppointment = await response.json(); // Get the updated appointment data from the response
    
                // Update the appointments state using the updated data from the server
                setAppointments((prevAppointments) => {
                    const updatedAppointments = prevAppointments.map(
                        (appointment) =>
                            appointment._id === appointmentId
                                ? updatedAppointment
                                : appointment
                    );
                    console.log(
                        "Updated appointments state:",
                        updatedAppointments
                    ); // Log the updated state
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
                    // You might want to add an error alert here
                    // alert(`Error confirming appointment: ${errorData.error || 'Unknown error'}`);
                } catch (parseError) {
                    console.error(
                        "Error parsing server response:",
                        parseError
                    );
                    // Alert for unexpected server response
                    alert(
                        "Unexpected response from the server. Please try again later."
                    );
                }
            }
        } catch (error) {
            console.error("Error confirming appointment:", error);
            // Alert for network errors
            alert("Network error. Please check your connection.");
        }
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
        <div className="upcoming-app-staff">
            <Sidebar />
            <div className="upcoming-app-content">
                <h6 className="therapist-schedule-title">
                    Upcoming Appointments
                </h6>
                <div className="appointments-container">
                    {loading && <p>Loading appointments...</p>}
                    {error && <p>{error}</p>}

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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <td>
                                            {appointment.appointment_type}
                                        </td>

                                        <td>{appointment.patient_name}</td>
                                        <td>
                                            {new Date(
                                                appointment.appointment_date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {new Date(
                                                appointment.start_time
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>
                                            {new Date(
                                                appointment.end_time
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>
                                            {appointment.appointment_status}
                                        </td>
                                        <td>
                                        <Button
    variant="contained"
    onClick={() => handleConfirmAppointment(appointment._id)}
    sx={{
      backgroundColor: 'green', // Directly set the background color to green
      color: 'white', // Set text color to white for contrast
      marginRight: '5px',
      '&:hover': {
        backgroundColor: 'darkgreen', // Darker green on hover
      },
    }}
  >
    Confirm
  </Button>
  <Button
    variant="contained"
    onClick={() => handleDeleteAppointment(appointment._id)}
    sx={{
      backgroundColor: 'red', // Directly set the background color to red
      color: 'white', // Set text color to white for contrast
      '&:hover': {
        backgroundColor: 'darkred', // Darker red on hover
      },
    }}
  >
    Delete
  </Button>
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