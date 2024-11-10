import React, { useState, useEffect } from "react";
import "./UpcomingAppStaff.css";
import Sidebar from "./Sidebar";
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
  Button,
} from "@mui/material";

export default function UpcomingAppStaff() {
  const [appointments, setAppointments] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All"); // State for type filter

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/appointments`);
        if (!response.ok) {
          throw new Error("Error fetching appointments");
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTherapists = async () => {
      try {
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/therapists`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Error fetching therapists");
        }
        const therapistsData = await response.json();
        setTherapists(therapistsData);
      } catch (error) {
        console.error("Error fetching therapists:", error);
      }
    };

    fetchAppointments();
    fetchTherapists();
  }, []);

  const handleTherapistChange = (event, appointmentId) => {
    const selectedTherapistId = event.target.value;
    setSelectedTherapist((prevState) => ({
      ...prevState,
      [appointmentId]: selectedTherapistId,
    }));
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const therapistId = selectedTherapist[appointmentId];
      if (!therapistId) {
        alert("Please select a therapist before confirming.");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_BACKEND_API}/api/appointments/${appointmentId}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ therapist_id: therapistId }),
        }
      );

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments((prevAppointments) => {
          return prevAppointments.map((appointment) =>
            appointment._id === appointmentId ? updatedAppointment : appointment
          );
        });
        alert("Appointment confirmed!");
      } else {
        try {
          const errorData = await response.json();
          console.error(
            "Error confirming appointment:",
            errorData.error || response.statusText
          );
          alert(
            "Error confirming appointment: " +
              (errorData.error || "Unknown error")
          );
        } catch (parseError) {
          console.error("Error parsing server response:", parseError);
          alert("Unexpected response from the server. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
      alert("Network error. Please check your connection.");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: "30px",
          marginLeft: "280px",
          transition: "margin 0.3s ease",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            textAlign: "center",
            marginBottom: "20px",
            marginTop: "20px",
            color: "#2d848b",
            fontWeight: "bolder",
          }}
        >
          Upcoming Appointments
        </Typography>
  {/* Filter Dropdowns */}
  <TableRow>
                <TableCell colSpan={8}>
                  <div className="filter-dropdown">
                    <div>
                      <label htmlFor="statusFilter">Filter by Status: </label>
                      <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="All">All</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="typeFilter">Filter by Type: </label>
                      <select
                        id="typeFilter"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        <option value="All">All</option>
                        <option value="Occupational Therapy">
                          Occupational Therapy
                        </option>
                        <option value="Speech Therapy">Speech Therapy</option>
                      </select>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
        <TableContainer component={Paper} sx={{ borderRadius: "8px", boxShadow: 3 }}>
          <Table aria-label="appointments table" sx={{ minWidth: 650 }}>
            
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#3F4662" }}>
                  Appointment Type
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3F4662" }}>
                  Assigned Therapist
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3F4662" }}>
                  Patient Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3F4662" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3F4662" }}>
                  Start Time
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3F4662" }}>
                  End Time
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3F4662" }}>
                  Status
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
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
                appointments
                  .filter((appointment) => {
                    if (statusFilter === "All") return true;
                    return appointment.appointment_status === statusFilter;
                  })
                  .filter((appointment) => {
                    // Add the type filter
                    if (typeFilter === "All") return true;
                    return appointment.appointment_type === typeFilter;
                  })
                  .map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment.appointment_type}</TableCell>
                      <TableCell>
                        {appointment.appointment_status === "Confirmed" && appointment.therapist_id ? (
                          therapists.find(
                            (therapist) =>
                              therapist._id === appointment.therapist_id
                          )?.therapist_name
                        ) : (
                          <select
                            value={selectedTherapist[appointment._id] || ""}
                            onChange={(e) => {
                              setSelectedTherapist((prevState) => ({
                                ...prevState,
                                [appointment._id]: e.target.value,
                              }));
                              handleTherapistChange(e, appointment._id);
                            }}
                          >
                            <option key="default-therapist" value="">
                              Select Therapist
                            </option>
                            {therapists.map((therapist) => (
                              <option key={therapist._id} value={therapist._id}>
                                {therapist.therapist_name}
                              </option>
                            ))}
                          </select>
                        )}
                      </TableCell>

                      <TableCell>{appointment.patient_name}</TableCell>
                      <TableCell>
                        {(() => {
                          const appointmentDate = new Date(
                            appointment.start_time
                          );
                          const formattedDate =
                            appointmentDate.toLocaleDateString("en-US");
                          return formattedDate;
                        })()}
                      </TableCell>
                      <TableCell>
                        {new Date(appointment.start_time).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(appointment.end_time).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </TableCell>
                      <TableCell>{appointment.appointment_status}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          color="success"
                          sx={{
                            marginRight: 1,
                            backgroundColor: "#2D848B",
                            color: "#fff",
                          }}
                          onClick={() =>
                            handleConfirmAppointment(appointment._id)
                          }
                        >
                          Confirm
                        </Button>

                        <Button
                          aria-label="delete"
                          color="error"
                          sx={{
                            marginRight: 1,
                            backgroundColor: "#e53935",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#d32f2f" },
                          }}
                          onClick={() =>
                            handleDeleteAppointment(appointment._id)
                          }
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