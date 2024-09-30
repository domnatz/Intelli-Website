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
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal state
  const [open, setOpen] = useState(false);
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
        const response = await fetch('http://localhost:3001/api/therapists'); 
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
      const response = await fetch('http://localhost:3001/api/schedules', {
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
  
  // Function to handle opening the modal for adding a new therapist
  const handleModalOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleModalClose = () => setOpen(false);

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
      const response = await fetch('http://localhost:3001/api/therapists', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTherapistData)
      });

      if (response.ok) {
        const addedTherapist = await response.json();
        console.log('Therapist added successfully!', addedTherapist);

        setTherapists([...therapists, addedTherapist]);

        setNewTherapistName('');
        setNewSpecialization('');
        setNewGender('');
        handleModalClose();

        alert('Therapist added successfully!');
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

  return (
    <div className="schedule-manager-layout">
      <Sidebar />
      <div className="schedule-manager-content">
        <h6 className="schedule-manager-title">Manage Therapist Schedule</h6>

        {/* Display error message if there's an error */}
        {error && <div className="error-message">{error}</div>} 

        <div className="schedule-manager-container">
          <Button variant="contained" color="primary" onClick={handleModalOpen} sx={{
            backgroundColor: '#2D848B',
            borderRadius: '18px',
            fontSize: '18px',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#94C5B5' }
          }}>
            Add Therapist Info
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
          <Box sx={{ maxWidth: 200, borderColor: '#3F4662', marginTop: -8, marginLeft: 60 }}>
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
                <MenuItem value="09:00">9:00am</MenuItem>
                <MenuItem value="11:00">11:00am</MenuItem> 
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
                <MenuItem value="09:00">9:00am</MenuItem>
                <MenuItem value="10:00">10:00am</MenuItem>
                <MenuItem value="12:00">12:00pm</MenuItem> 
                {/* Add more time slots as needed */}
              </Select>
            </FormControl>
          </Box>

          <button type="submit" className="assign" onClick={handleSubmit}>Assign</button>

          {/* Modal */}
          <Modal
            open={open}
            onClose={handleModalClose}
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
                />
                <TextField
                  label="Specialization"
                  fullWidth
                  margin="normal"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    label="Gender"
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
        </div>
      </div>
    </div>
  );
}