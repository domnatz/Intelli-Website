import React, { useState, useEffect } from 'react';
import './ScheduleManager.css';
import Sidebar from './Sidebar';

// Import Material-UI components
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField'; 
import Alert from '@mui/material/Alert';
import {
  Grid,
} from '@mui/material';

// Import date-pickers components
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';   

import { DatePicker } from '@mui/x-date-pickers/DatePicker';   


// Import dayjs for date handling
import dayjs from 'dayjs';

// Define styles for the modal using Material-UI's sx prop
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  color: '#3F4662',
  borderRadius: '20px',
  borderColor: '#3F4662',
  p: 4,
};

export default function ScheduleManager() {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [deleteTherapist, setDeleteTherapist] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal state
  const [addTherapistOpen, setAddOpen] = useState(false);
  const [deleteTherapistOpen, setDeleteOpen] = useState(false);
  const [newTherapistName, setNewTherapistName] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newGender, setNewGender] = useState('');

 // In ScheduleManager.js
const scheduleMapping = {
  '08:00-10:00': 'Morning',
  '10:00-12:00': 'Late Morning',
  '13:00-15:00': 'Afternoon', 
  '15:00-17:00': 'Late Afternoon'
};
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/therapists`); 
        if (!response.ok) {
          throw new Error('Error fetching therapists');
        }
        const data = await response.json();
        setTherapists(data);
        setError(null); 
      } catch (error) {
        console.error('Error fetching therapists:', error);
        setError('Failed to load therapists. ' + error.message); 
      }
    };

    fetchTherapists();
  }, []);

  const handleTherapistChange = (event) => {
    setSelectedTherapist(event.target.value);
    setDeleteTherapist(event.target.value);
  };

  const handleDateChange = (newDate) => {
    // Check if newDate is valid before proceeding
    if (!newDate || !dayjs.isDayjs(newDate) || !newDate.isValid()) {
      console.error('Invalid or null date selected:', newDate);
      setError('Please select a valid date.'); // Or handle the error in a more user-friendly way
      return; // Exit early if the date is invalid
    }

    const formattedDate = newDate.format('YYYY-MM-DD');
    setSelectedDate(newDate); // Store the Dayjs object in state
    console.log('Selected Date:', formattedDate);
  };
// Function to handle alert dismissal
const handleAlertClose = (alertType) => {
  if (alertType === 'error') {
      setError(null);
  } else if (alertType === 'success') {
      setSuccessMessage(null);
  }
};

// Use useEffect to automatically clear alerts after 5 seconds
useEffect(() => {
  let errorTimeout, successTimeout;
  if (error) {
      errorTimeout = setTimeout(() => {
          handleAlertClose('error');
      }, 5000);
  }
  if (successMessage) {
      successTimeout = setTimeout(() => {
          handleAlertClose('success');
      }, 5000);
  }

  // Cleanup function to clear timeouts if the component unmounts or alerts change
  return () => {
      clearTimeout(errorTimeout);
      clearTimeout(successTimeout);
  };
}, [error, successMessage]); // Re-run the effect whenever error or successMessage changes
  const handleStartTimeChange = (event) => {
    setSelectedStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setSelectedEndTime(event.target.value);
  };

  const handleSubmit   
 = async (event) => {
    event.preventDefault();   


    // Clear any previous error or success messages
    setError(null); 
    setSuccessMessage(null);

    // Basic validation 
    if (!selectedTherapist || !selectedDate || !selectedStartTime || !selectedEndTime) {
      setError('Please fill in all fields!');
      return;
    }

    // Check for valid time range 
    if (selectedStartTime >= selectedEndTime) {
      setError('Start time must be before end time!');
      return;
    }

    if (!deleteTherapist) {
      setError('Please select a therapist.');
      return;
    }
    
    // Prepare schedule data 
    const scheduleData = {
      therapist_id: selectedTherapist, 
      start_time: new Date(selectedDate.format('YYYY-MM-DD') + 'T' + selectedStartTime + ':00'), 
      end_time: new Date(selectedDate.format('YYYY-MM-DD') + 'T' + selectedEndTime + ':00'),
      // Ensure the 'schedule' field is set correctly using the scheduleMapping
      schedule: scheduleMapping[`${selectedStartTime}-${selectedEndTime}`]
    };

    // Log the scheduleData for debugging
    console.log("Schedule Data to be sent:", scheduleData);

    try {
      const response = await fetch(`${process.env.REACT_BACKEND_API}/api/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleData)
      });

      if (response.ok) {
        const newSchedule = await response.json(); 
        console.log('Schedule created successfully!', newSchedule);
        setSuccessMessage('Schedule assigned successfully!');

        // After creating a new schedule, refetch the therapists to update the list
        // fetchTherapists();

        // Clear the form or update the UI as needed
        setSelectedTherapist('');
        setSelectedDate(dayjs());
        setSelectedStartTime('');
        setSelectedEndTime('');
        setDeleteTherapist('');

      } else {
        // Enhanced error handling
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            setError(errorData.error); 
          } else {
            setError('An error occurred while assigning the schedule. Please try again later.');
          }
        } catch (parseError) {
          // Handle cases where the server doesn't return valid JSON 
          setError('Unexpected response from the server. Please try again later.');
          console.error('Error parsing server response:', parseError);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('A network error occurred. Please check your connection and try again.');
    }
  };
  
  // Function to handle opening the modal
  const handleAddModalOpen = () => setAddOpen(true);
  const handleDeleteModalOpen = () => setDeleteOpen(true);
  // Function to handle closing the modal
  const handleAddModalClose = () => setAddOpen(false);
  const handleDeleteModalClose = () => setDeleteOpen(false);

  // Function to handle adding a new therapist
  const handleAddTherapist = async (event) => {
    event.preventDefault(); 

    const newTherapistData = {
      therapist_name: newTherapistName,
      specialization: newSpecialization,
      therapist_gender: newGender,
      schedule: [] // Initialize schedule as an empty array
    };

    try {
      const response = await fetch(`${process.env.REACT_BACKEND_API}/api/therapists`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTherapistData)
      });

      if (response.ok) {
        const addedTherapist = await response.json();

        setTherapists([...therapists, addedTherapist]);

        setNewTherapistName('');
        setNewSpecialization('');
        setNewGender('');
        handleAddModalClose();

        setSuccessMessage('Therapist added successfully!');  
      } else {
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            setError(errorData.error);
          } else {
            setError('An error occurred while adding the therapist. Please try again later.');
          }
        } catch (parseError) {
          setError('Unexpected response from the server. Please try again later.');
          console.error('Error parsing server response:', parseError);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('A network error occurred. Please check your connection and try again.');
    }
  };

    const handleDeleteTherapist = async (event) => {
      event.preventDefault();
      
      const therapistId = deleteTherapist;
  
      if (
        window.confirm(
          "Are you sure you want to delete this therapist? This action cannot be undone."
        )
      ) {
        try {
          
          const response = await fetch(
            `${process.env.REACT_BACKEND_API}/api/therapists/${therapistId}`,
            {
              method: "DELETE",
            }
          );
  
          if (response.ok) {
            // Update the therapists state to remove the deleted therapist
            setTherapists((prevTherapists) =>
              prevTherapists.filter((therapist) => therapist._id !== therapistId)
            );
            setSuccessMessage('Therapist deleted successfully!');
            handleDeleteModalClose(); // Close the modal
          } else {
            // Handle error (e.g., display an error message)
            const errorData = await response.json();
            console.error(
              "Error deleting therapist:",
              errorData.error || response.statusText
            );
          }
        } catch (error) {
          console.error("Error deleting therapist:", error);
        }
      }
    };


  return (
    <div className="schedule-manager-layout">
      <Sidebar />
      <div className="schedule-manager-content">
        <h6 className="schedule-manager-title">Manage Therapist Schedule</h6>

        <div className="schedule-manager-container">
          <Button variant="contained" color="primary" onClick={handleAddModalOpen} sx={{
            backgroundColor: '#2D848B',
            marginLeft: '10px',
            borderRadius: '15px',
            marginBottom: '5px',
            fontSize: '18px',
            width: '250px',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#94C5B5' }
          }}>
            Add Therapist
          </Button>

          <Button 
            variant="contained"
            onClick={handleDeleteModalOpen}
            sx={{ 
                backgroundColor: '#E53935',
                borderRadius: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
                marginLeft: '10px',
                width: '250px',
                '&:hover': { backgroundColor: '#D32F2F' }
          }}>
            Delete Therapist
          </Button>

          <h4 className='therapist'>Therapist</h4>
          <Box sx={{ width: 410, borderColor: '#3F4662', marginBottom: 3, marginLeft: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Select Therapist</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedTherapist}
                label="Select Therapist"
                onChange={handleTherapistChange}
              >
                {/* Check if therapists data is available before rendering MenuItems */}
                {therapists.length > 0 ? (
                  therapists.map(therapist => (
                    <MenuItem key={therapist._id} value={therapist._id}>
                      {therapist.therapist_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading therapists...</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>

          <h4 className='date'> Date </h4>
          <Box sx={{ width: 300, borderColor: '#3F4662', marginTop: -8, marginLeft: 60 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>

          <h4 className='startTime'> Start Time </h4>
          <Box sx={{ width: 330, borderColor: '#3F4662', marginTop: 5, marginLeft: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="start-time-label">Select Start Time</InputLabel>
              <Select
                labelId="start-time-label"
                id="start-time-select"
                value={selectedStartTime}
                label="Select Start Time"
                onChange={handleStartTimeChange}
              >
                <MenuItem value="08:00">8:00am</MenuItem>
                <MenuItem value="10:00">10:00am</MenuItem>
                <MenuItem value="13:00">1:00pm</MenuItem> 
                {/* Add more time slots as needed */}
              </Select>
            </FormControl>
          </Box>

          <h4 className='EndTime'> End Time </h4>
          <Box sx={{ width: 330, borderColor: '#3F4662', marginTop: -7, marginLeft: 55 }}>
            <FormControl fullWidth>
              <InputLabel id="end-time-label">Select End Time</InputLabel>
              <Select
                labelId="end-time-label"
                id="end-time-select"
                value={selectedEndTime}
                label="Select End Time"
                onChange={handleEndTimeChange}
              >
                <MenuItem value="10:00">10:00am</MenuItem>
                <MenuItem value="12:00">12:00pm</MenuItem>
                <MenuItem value="15:00">3:00pm</MenuItem> 
                {/* Add more time slots as needed */}
              </Select>
            </FormControl>
          </Box>

           {/* Delete button next to the Select */}
           <div className="assign1-button-container">
           <Button variant="contained" color="primary" onClick={handleSubmit} sx={{
            backgroundColor: '#2D848B',
            borderRadius: '15px',
            fontSize: '18px',
            width: '200px',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#94C5B5' }
          }}>
            Assign
          </Button>
          </div>

          {/* Modal */}
          <Modal
            open={addTherapistOpen}
            onClose={handleAddModalClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-title" variant="h6" component="h2">
                Add Therapist
              </Typography>
              <form onSubmit={handleAddTherapist}>
                <TextField
                  label="Therapist Name"
                  fullWidth
                  margin="normal"
                  value={newTherapistName}
                  onChange={(e) => setNewTherapistName(e.target.value)}
                  required
                />
                <TextField
                  label="Specialization"
                  fullWidth
                  margin="normal"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  required
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    label="Gender"
                    required
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" sx={{
                  backgroundColor: '#2D848B',
                  borderRadius: '18px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginLeft: '110px',
                  '&:hover': { backgroundColor: '#94C5B5' }
                }}>
                  Add Therapist
                </Button>
              </form>
            </Box>
          </Modal>

          <Modal
            open={deleteTherapistOpen}
            onClose={handleDeleteModalClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-title" variant="h6" component="h2">
                Delete Existing Therapist
              </Typography>
              <form onSubmit={handleDeleteTherapist}>
              <Box sx={{ width: 410, borderColor: '#3F4662', marginBottom: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Therapist</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={deleteTherapist}
                      label="Select Therapist"
                      onChange={handleTherapistChange}
                    >
                      {/* Check if therapists data is available before rendering MenuItems */}
                      {therapists.length > 0 ? (
                      therapists.map(therapist => (
                      <MenuItem key={therapist._id} value={therapist._id}>
                        {therapist.therapist_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Loading therapists...</MenuItem>
                  )}
                  </Select>
                </FormControl>
              </Box>
                <Button type="submit" variant="contained" color="primary" sx={{
                  color:"error",
                  backgroundColor: '#2D848B',
                  borderRadius: '18px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginLeft: '110px',
                  '&:hover': { backgroundColor: '#94C5B5' }
                }}
                  disabled={!deleteTherapist}>
                  Delete Therapist
                </Button>
              </form>
            </Box>
          </Modal>
          {error && ( // Conditionally render the Alert for errors
                        <Alert onClose={() => handleAlertClose('error')} severity="error">{error}</Alert>
                    )}

                    {successMessage && ( // Conditionally render the Alert for success
                        <Alert onClose={() => handleAlertClose('success')} severity="success">{successMessage}</Alert>
                    )}

        </div>
      </div>
    </div>
  );
}