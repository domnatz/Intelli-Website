import React, { useState } from 'react';
import { Box, TextField, FormControlLabel, Checkbox, Typography, Button } from '@mui/material';

const AssessmentFormTwo = ({ onSubmit }) => { // Receive onSubmit as a prop
    // State for patient data
    const [patientData, setPatientData] = useState({
        patient_name: '',
        date_of_birth: '',
        patient_sex: '',
        patient_age: '',
        physician_name: '',
        school_skills: {
            school_name: '',
            grade_level: '',
            problems_in_school_activities: null, // Initialize as null
            school_activities_desc: '',
            problems_with_academics: null,     // Initialize as null
            academics_desc: '',
            focusing_school_problem: null,      // Initialize as null
        },
        physical_tasks: {
            performing_physical_tasks: null,    // Initialize as null
            physical_tasks_desc: '',
            complying_with_directives: null,    // Initialize as null
            directives_desc: '',
            communicating_with_others: null,    // Initialize as null
            communication_desc: '',
            taking_care_of_himself: null,       // Initialize as null
            self_care_desc: '',
            interacting_with_others: null,      // Initialize as null
            interaction_desc: '',
            feeding_problem: null,               // Initialize as null
            dressing_problem: null,              // Initialize as null
            walking_problem: null,               // Initialize as null
            bathroom_problem: null,              // Initialize as null
        }
    });

    // Handle changes for patient data
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setPatientData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNestedInputChange = (section, field) => (event) => {
        const { value, type, checked } = event.target;
        setPatientData((prevState) => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                [field]: type === 'checkbox' ? checked : value
            }
        }));
    };

    // Handle form submission
const handleSubmit = (event) => {
    event.preventDefault();

    // Data type conversions and validation
    const updatedPatientData = {
        ...patientData,
        patient_age: Number(patientData.patient_age),
    };

    // Additional validation (optional)
    if (isNaN(updatedPatientData.patient_age)) {
        alert("Please enter a valid number for patient age.");
        return;
    }

    // Exclude fields not relevant to occupational therapy
    const dataToSend = {
        ...updatedPatientData,
        therapy_types: ['ot'] // Set therapy_types to 'ot' for this form
    };
    delete dataToSend.sle_concerns;
    delete dataToSend.sle_receptive_skills;
    delete dataToSend.sle_motor_skills;

    onSubmit(dataToSend);
};
    return (
        <Box
          sx={{
            padding: '20px',
            backgroundColor: '#FDF3EB',
            border: '2px solid #C6C6C6',
            borderRadius: '10px',
            maxWidth: '800px',
            margin: 'auto',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontStyle: 'italic', marginBottom: '20px', color: '#3F4662' }}>
            Occupational Therapy Case History Form (Initial Evaluation)
          </Typography>
    
          <Typography variant="body2" gutterBottom sx={{ fontStyle: 'italic', marginBottom: '20px' }}>
            Please provide the information asked for. The information below is strictly
            confidential and for professional use only. This will help the occupational
            Therapist to understand your child better for optimal intervention planning.
            Thank you.
          </Typography>
    
          <form onSubmit={handleSubmit}>
            {/* General Information */}
            <Box
              sx={{
                backgroundColor: '#94C5B5', 
                marginBottom: '20px',
                border: '1px solid black',
              }}
            >
              <Typography variant="h5">
                General Information
              </Typography>
            </Box>
    
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <TextField
                required
                id="patient_name"
                name="patient_name"
                label="Child's Name"
                fullWidth
                variant="outlined"
                value={patientData.patient_name}
                onChange={handleInputChange}
                sx={{
                  flex: '1 1 45%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                }}
              />
    
              <TextField
                required
                id="patient_age"
                name="patient_age"
                label="Age"
                fullWidth
                variant="outlined"
                value={patientData.patient_age}
                onChange={handleInputChange}
                sx={{
                  flex: '1 1 20%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                }}
              />
              <TextField
                required
                id="date_of_birth"
                name="date_of_birth"
                label="Date of Birth"
                fullWidth
                variant="outlined"
                type="date" 
                value={patientData.date_of_birth}
                onChange={handleInputChange}
                sx={{
                  flex: '1 1 30%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                }}
              />
    
            </Box>
    
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '16px',
                marginTop: '16px',
              }}
            >
              <Typography> Sex: </Typography>
              <FormControlLabel
                control={<Checkbox checked={patientData.patient_sex === 'Male'} onChange={() => handleInputChange({ target: { name: 'patient_sex', value: patientData.patient_sex === 'Male' ? '' : 'Male' } })} name="patient_sex" color="primary" />}
                label="Male"
              />
              <FormControlLabel
                control={<Checkbox checked={patientData.patient_sex === 'Female'} onChange={() => handleInputChange({ target: { name: 'patient_sex', value: patientData.patient_sex === 'Female' ? '' : 'Female' } })} name="patient_sex" color="primary" />}
                label="Female"
              />
              {/* Add "Other" option if needed */}
            </Box>
    
    
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '16px',
                marginTop: '16px',
              }}
            >
              <TextField
                required
                id="physician_name"
                name="physician_name"
                label="Child's Physician"
                fullWidth
                variant="outlined"
                value={patientData.physician_name}
                onChange={handleInputChange}
                sx={{
                  flex: '1 1 45%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                }}
              />
            </Box>
    
            {/* School Skills and Participation */}
            <Box
              sx={{
                backgroundColor: '#94C5B5',
                marginBottom: '20px',
                border: '1px solid black',
              }}
            >
              <Typography variant="h5">School Skills and Participation</Typography>
            </Box>
    
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <TextField
                id="school_name"
                name="school_name"
                label="School Name"
                fullWidth
                variant="outlined"
                value={patientData.school_skills.school_name}
                onChange={handleNestedInputChange('school_skills', 'school_name')}
                sx={{
                  flex: '1 1 45%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                }}
              />
    
    <TextField
  id="grade_level"
  name="grade_level"
  label="Grade / Level"
  fullWidth
  variant="outlined"
  value={patientData.school_skills.grade_level || ''} // Default to empty string if undefined
  onChange={handleNestedInputChange('school_skills', 'grade_level')}
  sx={{
    flex: '1 1 20%', // Adjust flex basis as needed for your layout
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px', // Apply rounded corners to the input field itself
    },
  }}
/>


                <FormControlLabel
                    control={
                        <Checkbox
                            checked={patientData.school_skills.problems_in_school_activities || false} // Default to false if null
                            onChange={handleNestedInputChange('school_skills', 'problems_in_school_activities')}
                            name="problems_in_school_activities"
                            color="primary"
                        />
                    }
                    label="Problems in school activities"
                />

                <TextField
                    id="school_activities_desc"
                    name="school_activities_desc"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    value={patientData.school_skills.school_activities_desc || ''}
                    onChange={handleNestedInputChange('school_skills', 'school_activities_desc')}
                    disabled={!patientData.school_skills.problems_in_school_activities}
                    sx={{
                        flex: '1 1 45%',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                        },
                    }}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={patientData.school_skills.problems_with_academics || false} // Default to false if null
                            onChange={handleNestedInputChange('school_skills', 'problems_with_academics')}
                            name="problems_with_academics"
                            color="primary"
                        />
                    }
                    label="Problems with academics"
                />

                <TextField
                    id="academics_desc"
                    name="academics_desc"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    value={patientData.school_skills.academics_desc || ''}
                    onChange={handleNestedInputChange('school_skills', 'academics_desc')}
                    disabled={!patientData.school_skills.problems_with_academics}
                    sx={{
                        flex: '1 1 45%',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                        },
                    }}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={patientData.school_skills.focusing_school_problem || false} // Default to false if null
                            onChange={handleNestedInputChange('school_skills', 'focusing_school_problem')}
                            name="focusing_school_problem"
                            color="primary"
                        />
                    }
                    label="Focusing is a problem in school"
                />
            </Box>
            {/* Physical Tasks */}
            <FormControlLabel
  control={
    <Checkbox
      checked={patientData.physical_tasks.complying_with_directives || false} 
      onChange={handleNestedInputChange('physical_tasks', 'complying_with_directives')}
      name="complying_with_directives"
      color="primary"
    />
  }
  label="Difficulty complying with directives"
/>

<TextField
  id="directives_desc"
  name="directives_desc"
  label="Description" 
  fullWidth
  variant="outlined"
  value={patientData.physical_tasks.directives_desc || ''}
  onChange={handleNestedInputChange('physical_tasks', 'directives_desc')}
  disabled={patientData.physical_tasks.complying_with_directives !== true} 
  sx={{
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
    },
  }}
/>

<FormControlLabel
  control={
    <Checkbox
      checked={patientData.physical_tasks.communicating_with_others || false}
      onChange={handleNestedInputChange('physical_tasks', 'communicating_with_others')}
      name="communicating_with_others"
      color="primary"
    />
  }
  label="Difficulty communicating with others"
/>

<TextField
  id="communication_desc"
  name="communication_desc"
  label="Description" 
  fullWidth
  variant="outlined"
  value={patientData.physical_tasks.communication_desc || ''} 
  onChange={handleNestedInputChange('physical_tasks', 'communication_desc')}
  disabled={patientData.physical_tasks.communicating_with_others !== true} 
  sx={{
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
    },
  }}
/>

<FormControlLabel
  control={
    <Checkbox
      checked={patientData.physical_tasks.taking_care_of_himself || false}
      onChange={handleNestedInputChange('physical_tasks', 'taking_care_of_himself')}
      name="taking_care_of_himself"
      color="primary"
    />
  }
  label="Difficulty taking care of himself"
/>

<TextField
  id="self_care_desc"
  name="self_care_desc"
  label="Description" 
  fullWidth
  variant="outlined"
  value={patientData.physical_tasks.self_care_desc || ''} 
  onChange={handleNestedInputChange('physical_tasks', 'self_care_desc')}
  disabled={patientData.physical_tasks.taking_care_of_himself !== true} 
  sx={{
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
    },
  }}
/>

<FormControlLabel
  control={
    <Checkbox
      checked={patientData.physical_tasks.interacting_with_others || false} 
      onChange={handleNestedInputChange('physical_tasks', 'interacting_with_others')}
      name="interacting_with_others"
      color="primary"
    />
  }
  label="Difficulty interacting with other children"
/>

<TextField
  id="interaction_desc"
  name="interaction_desc"
  label="Description" 
  fullWidth
  variant="outlined"
  value={patientData.physical_tasks.interaction_desc || ''} 
  onChange={handleNestedInputChange('physical_tasks', 'interaction_desc')}
  disabled={patientData.physical_tasks.interacting_with_others !== true} 
  sx={{
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
    },
  }}
/>

<FormControlLabel
  control={
    <Checkbox
      checked={patientData.physical_tasks.feeding_problem || false} 
      onChange={handleNestedInputChange('physical_tasks', 'feeding_problem')}
      name="feeding_problem"
      color="primary"
    />
  }
  label="Feeding problem"
/>

<FormControlLabel
  control={
    <Checkbox
      checked={patientData.physical_tasks.dressing_problem || false} 
      onChange={handleNestedInputChange('physical_tasks', 'dressing_problem')}
      name="dressing_problem"
      color="primary"
    />
  }
  label="Dressing problem"
/>

<FormControlLabel
  control={
    <Checkbox
      checked={patientData.physical_tasks.walking_problem || false} 
      onChange={handleNestedInputChange('physical_tasks', 'walking_problem')}
      name="walking_problem"
      color="primary"
    />
  }
  label="Walking problem"
/>

<FormControlLabel
  control={
    <Checkbox
      checked={patientData.physical_tasks.bathroom_problem || false} 
      onChange={handleNestedInputChange('physical_tasks', 'bathroom_problem')}
      name="bathroom_problem"
      color="primary"
    />
  }
  label="Bathroom problem"
/>
 {/* Navigation Buttons */}
 <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            marginTop: '20px',
          }}
        >
          <Button type="submit" variant="contained" color="primary" sx={{ backgroundColor: '#42a5f5', borderRadius: '50px' }}>
            Continue
          </Button>
        </Box>

      </form> {/* Closing form tag */}
    </Box>
  );
};

export default AssessmentFormTwo;