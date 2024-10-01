import React, { useState, useEffect } from 'react';
import './Appointments.css';
import FormOne from '../guardian/AssessmentForm.js';
import FormTwo from '../guardian/AssessmentFormTwo.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import   
 TextField from '@mui/material/TextField';   
 


import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';

import logo from '../../images/logo.png';

// Extend Day.js with the utc plugin
dayjs.extend(utc);


const CustomAccordion = styled(Accordion)({ 
  backgroundColor: '#C66B6A99',
  width: '80%',
  borderRadius: '20px',
  margin: '10px',
  justifyContent: 'center',
  textAlign: 'center'
});


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

    setActiveForm(form);
    setExpanded(nextPanel);
};

const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
};

const handleNextAccordion = (nextPanel) => {
    setExpanded(nextPanel);
};

const handleFormSubmit = (formData) => {
  setPatientData(formData); 
  handleNextAccordion('panel5'); 
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
    if (!patientId) {
        const savePatientResponse = await fetch(`${process.env.REACT_BACKEND_API}/api/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData) // Send the full patientData here
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

        const updatePatientResponse = await fetch(`/api/patients/${patientId}`, {
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
          appointment_date: formattedSelectedDate, 
          start_time: selectedTime.start.toISOString(),
          end_time: selectedTime.end.toISOString(),     
          patient_id: patientId,
          patient_name: patientData.patient_name,
          appointment_type: currentTherapyType === 'slp' ? 'Speech Therapy' : 'Occupational Therapy', 
          appointment_status: 'Scheduled', 
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
        alert('Appointment created successfully!');

    } else {
        // Handle the case where patientId is still undefined after patient creation/update
        throw new Error('Failed to create or update patient. Cannot create appointment.');
    }

} catch (error) {
    console.error('Error during submission:', error);
    alert(error.message); // Show a more specific error message to the user
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
      <header>
        <img className="Logo" src={logo} alt="Logo" />

        <nav>
          <li className="apt-list">
            <Link to="/" className="guardianHome">
              Home
            </Link>
          </li>
          <li className="apt-list">
            <Link>
              Child's Progress
            </Link>
          </li>
        </nav>

        {isLoggedIn && ( // Conditionally render logout button
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        )} 
      </header>

      <main>
        <h1 style={{ marginTop: 0, paddingTop: 70 }}> Schedule Your Appointment Today </h1>

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
                  <h3>Speech Language Pathology</h3>
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
                  <h3>Occupational Therapy</h3>
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
            <div className="ConfirmInfo">
              <p>Are you sure you want to confirm this appointment?</p> 

              <button onClick={handleSubmitAppointment}>Confirm Appointment</button> 
            </div>
          </AccordionDetails>
        </CustomAccordion>
      </div>
    </main>
  </div>
);
}