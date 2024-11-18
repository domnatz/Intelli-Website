import React, { useState, useEffect } from 'react';
import './Appointments.css';
import FormOne from '../guardian/AssessmentForm.js';
import FormTwo from '../guardian/AssessmentFormTwo.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import TextField from '@mui/material/TextField';   
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert'; // Import the Alert component
import Snackbar from '@mui/material/Snackbar'; // Import the Snackbar component
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';

import logo from '../../images/logo.png';

import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material'; {/*New*/}

<meta name="viewport" content="width=device-width, initial-scale=1.0" />

// Extend Day.js with the utc plugin
dayjs.extend(utc);


const CustomAccordion = styled(Accordion)({ 
  backgroundColor: '#C66B6A99',
  width: '80%',
  borderRadius: '20px',
  margin: '10px',
  justifyContent: 'center',
  textAlign: 'center',

  '@media (max-width: 600px)': {
    borderRadius: '10px', // Smaller border radius on phones
  }
}); {/*New*/}

export default function Appointments({ therapyType, isLoggedIn, onLogout  }) { // Destructure therapyType from props
  const [activeForm, setActiveForm] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [setPatientId] = useState(null); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null); 
  const [assessmentData, setAssessmentData] = useState(null);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
  // ... other imports and state declarations
  const handleDateChange = (date) => {
    // Convert the date to a Dayjs object if it's not already
    const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date);
  
    if (dayjsDate.isValid()) {
      // Store the Day.js object directly in the state
      setSelectedDate(dayjsDate); // No formatting here
  
      // For debugging, you can still format and log the date
      console.log('Selected Date (Local):', dayjsDate.format('YYYY-MM-DD')); 
    } else {
      console.error('Invalid date selected:', date);
      setError('Please select a valid date.');
    }
  };
  const [currentTherapyType, setCurrentTherapyType] = useState(therapyType); // Local state to track therapyType

  useEffect(() => {
    console.log("therapyType received in Appointments:", therapyType); 
}, [therapyType]); 

const handleTimeSelection = (time) => {
  if (!selectedDate) {
    setError('Please select a date first.'); // Set an error message
    return; // Exit the function early
  } 

  // Split the time range into start and end times
  
  const [startTimeStr, endTimeStr] = time.split('-');

  // Assuming your selectedDate is already a Day.js object
  const startTime = selectedDate.clone() // Clone to avoid modifying the original selectedDate
                            .hour(parseInt(startTimeStr.split(':')[0], 10))
                            .minute(parseInt(startTimeStr.split(':')[1], 10));
  const endTime = selectedDate.clone()  // Clone to avoid modifying the original selectedDate
                          .hour(parseInt(endTimeStr.split(':')[0], 10))
                          .minute(parseInt(endTimeStr.split(':')[1], 10));
 
  // Update the state with the Day.js objects
  setSelectedTime({
      start: startTime,
      end: endTime
  }); 
  
    console.log('Selected Time:', startTime.format(), endTime.format());  // Log the formatted times
  };

  const handleSelectFormAndExpandAccordion = (form, nextPanel) => {
    if (!form) {
        alert("Please select a form before continuing!");
        return;
    }

    setCurrentTherapyType(form === 'form1' ? 'slp': 'ot'); //sets the therapyType when selecting a form.
    console.log("currentTherapyType set to:", currentTherapyType);
    therapyType = currentTherapyType;

    setActiveForm(form);
    setExpanded(nextPanel);
};

const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
};

const handleNextAccordion = (nextPanel) => {
    setExpanded(nextPanel);
};

const toggleDrawer = (open) => {
  setDrawerOpen(open);
};

const handleFormSubmit = (formData) => {
  setPatientData(formData); 
  handleNextAccordion('panel5'); 
};

const handleLogout = async () => {
  setError(null);

  try {
    const response = await fetch(`${process.env.REACT_BACKEND_API}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(
        errorData.error || "An error occurred during logout. Please try again later."
      );
    } else {
      sessionStorage.clear();
      onLogout();
    }
  } catch (error) {
    setError("Network error. Please try again later.");
    console.error("Network error:", error);
  }
};
const handleSubmitAppointment = async () => {
  // Check if patientData and selectedDate are set
  if (!patientData || !selectedDate || !selectedTime) {
    alert("Please complete all steps before confirming the appointment!");
    return;
  }

  const formattedSelectedDate = dayjs(selectedDate).format('YYYY-MM-DD');

  try {
    // 1. Save patient data (if new patient) or update existing patient
    let patientId = patientData?._id;
    const guardian_id = sessionStorage.getItem('userId'); //sets the guardian_id to the current user's userId

    if (!patientId) {
        
        const savePatientResponse = await fetch(`${process.env.REACT_BACKEND_API}/api/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...patientData, guardian_id}), // Send the full patientData here
            credentials: 'include' 
        });

        if (!savePatientResponse.ok) {
            const errorData = await savePatientResponse.json();
            throw new Error(`Error saving patient data: ${errorData.error}`);
        }

        const savedPatientData = await savePatientResponse.json();
        patientId = savedPatientData._id;
    } else {
        // If patientId exists, make a PUT request to update patient data
        // Conditionally update data based on therapyType
        const dataToUpdate = { ...patientData };
        if (therapyType === 'ot') {
            delete dataToUpdate.sle_concerns;
            delete dataToUpdate.sle_receptive_skills;
            delete dataToUpdate.sle_motor_skills;
        }

        const updatePatientResponse = await fetch(`${process.env.REACT_BACKEND_API}/api/patients/${patientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToUpdate),
        });

        if (!updatePatientResponse.ok) {
            const errorData = await updatePatientResponse.json(); // Get error details from the response
            throw new Error(`Error updating patient data: ${errorData.error || updatePatientResponse.statusText}`); 
        }
    }

    // 2. Create the appointment (only if patientId is defined)
    // 2. Create the appointment (only if patientId is defined)
    if (patientId) {
      console.log("currentTherapyType used for appointment creation:", currentTherapyType); 
      
      const createAppointmentResponse = await fetch(`${process.env.REACT_BACKEND_API}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...patientData,
          guardian_id: guardian_id, 
          appointment_date: formattedSelectedDate, 
          start_time: selectedTime.start.toISOString(),
          end_time: selectedTime.end.toISOString(),     
          patient_id: patientId,
          patient_name: patientData.patient_name,
          appointment_type: currentTherapyType === 'slp' ? 'Speech Therapy' : 'Occupational Therapy', 
          appointment_status: 'Pending', 
          therapyType: currentTherapyType,
          // ... add other appointment-related data as needed
        })
      });

        if (!createAppointmentResponse.ok) {
            const errorData = await createAppointmentResponse.json(); // Get error details from the response
            throw new Error(`Error creating appointment: ${errorData.error || createAppointmentResponse.statusText}`);
        }

        const responseData = await createAppointmentResponse.json();
        console.log(responseData);

        // Handle success
        setAlertOpen(true);

    } else {
        // Handle the case where patientId is still undefined after patient creation/update
        throw new Error('Failed to create or update patient. Cannot create appointment.');
    }

} catch (error) {
  setErrorMessage(error.message); // Set the error message
  setErrorAlertOpen(true); // Show the error alert
}
};

const submitAssessmentData = async (patientData) => {
    const dataToSend = {
        assessmentType: 'sle',
        assessmentData: patientData
    };

    try {
        // 1. First, create a new patient record (POST request)
        const createPatientResponse = await fetch(`${process.env.REACT_BACKEND_API}/api/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (!createPatientResponse.ok) {
            throw new Error('Network response was not ok while creating patient');
        }

        const newPatientData = await createPatientResponse.json();
        const newPatientId = newPatientData._id;
        setPatientId(newPatientId);

        // 2. Now, update the assessment data for this new patient (PUT request)
        const updateAssessmentResponse = await fetch(`${process.env.REACT_BACKEND_API}/api/patients/${newPatientId}/assessment`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (!updateAssessmentResponse.ok) {
            throw new Error('Network response was not ok while updating assessment');
        }

        const responseData = await updateAssessmentResponse.json();
        console.log(responseData);

    } catch (error) {
        console.error('Error submitting assessment data:', error);
        // Handle error 
        alert('An error occurred while submitting the assessment. Please try again later.');
    }

    // Handle accordion transition regardless of success or failure
    handleNextAccordion('panel5'); // Move to the confirmation panel
};

return (
  <div className="Appointment-pg-cnt">
   <div  className="Appointment-pg-cnt"> {/*New*/}
    <AppBar position="fixed" sx={{ backgroundColor: '#94C5B5', zIndex: 1000, height: 90 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img className="Logo" src={logo} alt="Logo" style={{ marginRight: 'px', width: '70px', height: '60px' }} />
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '100px' }}>
          <nav>
              <li className="navbar-link" ><a href="/">Home</a></li>
              <li className="navbar-link">Appointment</li>
              <li className="navbar-link"><a href="/progress">Child's Progress</a></li>
          </nav>
          
        </Box>

        <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </Box>
        <IconButton
      color="inherit"
      edge="end"
      onClick={() => toggleDrawer(true)}
      sx={{ display: { xs: 'block', md: 'none' }, 
        ml: 2,
        '&.MuiIconButton-root': { 
          minWidth: 0,
          minHeight: 0,
          padding: '0px',
          boxShadow: 'none',
          '& .MuiSvgIcon-root': { 
            padding: '0px'
          }
        }
      }}
      
    >
          <MenuIcon />
        </IconButton>

      </Toolbar>
    

      <Drawer
        className="Nav-bar-drawer"
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        PaperProps={{
          sx: {
            zIndex: 1301, // Ensure the drawer is above the AppBar
          },
        }}
      >

<List sx={{ width: 250,  }}>
  <ListItem>
    <a href="/">
    <ListItemText
      primary="Home"
      primaryTypographyProps={{ fontWeight: 'bold', color: 'white', fontSize: '18px'}}
    />
    </a>
  </ListItem>

  <ListItem>
    <ListItemText
      primary="Appointment"
      primaryTypographyProps={{ fontWeight: 'bold', color: 'white', fontSize: '18px' }}
    />
  </ListItem>

  <ListItem>
    <a href="/progress">
    <ListItemText
      primary="Child's Progress"
      primaryTypographyProps={{ fontWeight: 'bold', color: 'white', fontSize: '18px' }}
    />
    </a>
  </ListItem>
</List>

  <div className="Nav-bar-drawer-footer">
    <p>&copy; IntelliSpeech Therapy Center</p>
  </div>
  </Drawer>
    </AppBar>
  </div> {/*New*/}

    <main>
    <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
  <Alert onClose={() => setAlertOpen(false)} severity="success" sx={{ width: '100%' }}>
    Appointment created successfully!
  </Alert>
</Snackbar>

<Snackbar open={errorAlertOpen} autoHideDuration={6000} onClose={() => setErrorAlertOpen(false)}>
  <Alert onClose={() => setErrorAlertOpen(false)} severity="error" sx={{ width: '100%' }}>
    {errorMessage}
  </Alert>
</Snackbar>
      <h1 className="title-heading"> Schedule Your Appointment Today </h1> {/*New*/}

      <div className="Accordion-grp">
        <CustomAccordion expanded={expanded === 'panel1'} onChange={() => setExpanded(expanded === 'panel1' ? null : 'panel1')}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="pnl1-cnt"
            className="pnl1-head">

            <h2> Choose Appointment </h2>
          </AccordionSummary>
          <AccordionDetails>
            <div className="SLPBook">
              <div className="book-cnt">
                <h3 className='choose-lbl'>Speech Language Pathology</h3>
                
                <p>
                  Specialist in the evaluation, diagnosis, treatment, and prevention of communication disorders
                  (speech and language impairments), cognitive-communication disorders, voice disorder across
                  the lifespan.
                </p>

                <p>
                  Assessment - Php 2, 500 <br />
                  Therapy - PHP 700
                </p>
              </div>
              <div className="btn-container"> <button className="book-btn" onClick={() => handleSelectFormAndExpandAccordion('form1', 'panel2')}> Book </button>
              </div>
            </div>

            <div className="OTBook">
              <div className="book-cnt">
                <h3 className='choose-lbl' >Occupational Therapy</h3>

                <p>
                  Involves the therapeutic use of everyday activities, or occupations, to treat the physical, mental,
                  developmental. and emotional ailments that impact patient's ability to perform daily tasks.
                </p>

                <p>
                  Assessment - Php 2, 500 <br />
                  Therapy - PHP 700
                </p>
              </div>
              <div className="btn-container">
                <button className="book-btn" onClick={() => handleSelectFormAndExpandAccordion('form2', 'panel2')}> Book </button>
              </div>
            </div>
          </AccordionDetails>
        </CustomAccordion>

        <CustomAccordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="pnl2-cnt"
            className="pnl2-head">

            <h2> Choose Time and Date </h2>
          </AccordionSummary>
          <AccordionDetails>
            <div className="chooseTimeDate">
              <div className="chooseDate">
                <h2> Date </h2>
                <TextField
                  type="date"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => handleDateChange(e.target.value)}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                  }}
                />
              </div>

              <div className="chooseTime">
                <h2> Time Available </h2>
                <div className="Times">
<button
  className={`Time ${selectedTime === '08:00-10:00' ? 'selected' : ''}`}
  onClick={() => handleTimeSelection('08:00-10:00')} 
>
  8:00 - 10:00 
</button>
<button
  className={`Time ${selectedTime === '10:00-12:00' ? 'selected' : ''}`}
  onClick={() => handleTimeSelection('10:00-12:00')}
>
  10:00 - 12:00 
</button>
<button
  className={`Time ${selectedTime === '13:00-15:00' ? 'selected' : ''}`}
  onClick={() => handleTimeSelection('13:00-15:00')}
>
  1:00 - 3:00 
</button>
<button
  className={`Time ${selectedTime === '15:00-17:00' ? 'selected' : ''}`}
  onClick={() => handleTimeSelection('15:00-17:00')}
>
  3:00 - 5:00
</button>
</div>
              </div>
            </div>

            <div className="continue-cnt">
              <button className="continue-btn" onClick={() => handleNextAccordion('panel3')}>Continue</button>
            </div>
          </AccordionDetails>
        </CustomAccordion>

        <CustomAccordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="pnl3-cnt"
            className="pnl3-head">

            <h2> Patient Information </h2>
          </AccordionSummary>
          <AccordionDetails>
            {activeForm === 'form1' && (
              <FormOne onSubmit={handleFormSubmit} /> 
            )}
      
            {activeForm === 'form2' && (<FormTwo onSubmit={handleFormSubmit} />)}
          </AccordionDetails>
        </CustomAccordion>

  
      <CustomAccordion expanded={expanded === 'panel5'} onChange={handleAccordionChange('panel5')}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="pnl5-cnt"
          className="pnl5-head">

          <h2> Confirmation </h2>
        </AccordionSummary>
        <AccordionDetails>
          <div>
          <h3 className="ConfirmInfo">Are you sure you want to confirm this appointment?</h3> {/*New*/}

            <button onClick={handleSubmitAppointment} className="Confirm-btn">Yes</button> {/*New*/}
          </div>
        </AccordionDetails>
      </CustomAccordion>
    </div>
  </main>
</div>
);
}
