import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
} from '@mui/material';

const AssessmentForm = ({ onSubmit }) => {
  const [patientData, setPatientData] = useState({
    patient_name: '',
    date_of_birth: '',
    patient_sex: '',
    patient_age: '',
    physician_name: '',
    diagnosis: '',
    siblings: [],
    sle_concerns: {
      speech_concern: '', // Initialize as an empty string
      concern_noticed_date: '',
    },
    sle_receptive_skills: {
      responds_to_name: null,
      gets_common_objects: null,
      follows_simple_directions: null,
      points_to_pictures: null,
      names_pictures: null,
      asks_questions: null,
      repeats_expressions: null,
      repeats_questions_instead_of_answering: null,
      excessively_recites_words: null,
      said_word_then_stopped_using: null,
      said_word_then_stopped_using_date: '',
      language_development_stopped: null,
      language_development_stopped_date: '',
    },
    sle_motor_skills: {
      crawled_age: '',
      sat_alone_age: '',
      walked_unaided_age: '',
      fed_self_age: '',
      dressed_self_age: '',
      toilet_trained_age: '',
      cooing_age: '',
      babbles: false,
      babbling_age: '',
      said_first_word: false,
      first_word_age: '',
      first_word: '',
      can_understand_50: false,
      understood_50_words_age: '',
      sample_understood_words: '',
      expressed_50: false,
      expressed_50_words_age: '',
      sample_expressed_words: '',
      fluent_words: false,
      stuttering: false,
      articulation_difficulty: false,
      inconsistent_voice: false,
    },
    therapy_types: ['slp'],
    
  });


  // Handle changes for child's sex
  const handleSexChange = (event) => {
    setPatientData({ ...patientData, patient_sex: event.target.value });
  };

  // Handle changes for sibling's sex
  const handleSiblingSexChange = (index, event) => {
    const updatedSiblings = [...patientData.siblings];
    updatedSiblings[index].sibling_sex = event.target.value;
    setPatientData({ ...patientData, siblings: updatedSiblings });
  };



  const handleCheckboxChange = (section, field, value) => {
    setPatientData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would typically send the patientData to your backend for saving.
    console.log(patientData);
    onSubmit(patientData); 
     // Data type conversions and validation
     const updatedPatientData = {
      ...patientData,
      patient_age: Number(patientData.patient_age), // Convert to Number
      sle_concerns: {
        ...patientData.sle_concerns,
        speech_concern: patientData.sle_concerns.speech_concern === 'true', // Convert to Boolean
      }
    };

    // Additional validation (optional)
    if (isNaN(updatedPatientData.patient_age)) {
      alert("Please enter a valid number for patient age.");
      return;
    }
    // You can add more validation checks as needed

    onSubmit(updatedPatientData); 
  
  };
  

  const handleAddSibling = () => {
    setPatientData(prevData => ({
      ...prevData,
      siblings: [...prevData.siblings, { sibling_name: '', sibling_age: '', sibling_sex: '' }],
    }));
  };

  return (
    <Box
    sx={{
      padding: '20px',
          backgroundColor: '#FDF3EB',
          border: '2px solid #C6C6C6',
          borderRadius: '10px',
          width: '94%', //CHANGED
          margin: 'auto',
    }}
    >
     <Typography variant="h4" gutterBottom sx={{ marginBottom: '20px', color: '#2d848b', fontWeight: 'Bolder' }}>
        Child Case History form - For Initial Evaluation (SLP Focus)
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ fontStyle: 'italic', marginBottom: '20px' }}>
        The following information is for professional use and will be handled confidently. This information will assist
        the speech language pathologist in completing your child's evaluation. Please complete the following questions
        as fully and accurately as possible. If you are unable to complete a question, please leave it blank or you may   

        contact the speech pathologist for assistance.
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* General Info */}
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
            onChange={(e) => setPatientData({ ...patientData, patient_name: e.target.value })}
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
            onChange={(e) => setPatientData({ ...patientData, patient_age: e.target.value })}
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
  type="date"  // Change the type to "date"
  value={patientData.date_of_birth} // Make sure this is formatted as 'YYYY-MM-DD'
  onChange={(e) => setPatientData({ ...patientData, date_of_birth: e.target.value })}
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
            control={
              <Checkbox
                checked={patientData.patient_sex === 'Male'}
                onChange={handleSexChange}
                value="Male"
                name="patient_sex"
                color="primary"
              />
            }
            label="Male"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={patientData.patient_sex === 'Female'}
                onChange={handleSexChange}
                value="Female"
                name="patient_sex"
                color="primary"
              />
            }
            label="Female"
          />
          {/* Add Checkbox for "Other" if needed */}
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
            onChange={(e) => setPatientData({ ...patientData, physician_name:e.target.value })}
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
            id="diagnosis"
            name="diagnosis"
            label="Child's Diagnosis"
            fullWidth
            variant="outlined"
            value={patientData.diagnosis}
            onChange={(e) => setPatientData({ ...patientData, diagnosis: e.target.value })}
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

        {/* Sibling Information - Retain only name, age, and sex */}
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: '30',
            marginTop: '30px',
          }}
        >
          Sibling Information (Child's Brother and/or Sister)
        </Typography>

        {/* Dynamically render sibling input fields */}
        {patientData.siblings.map((sibling, index) => (
          <Box key={index}
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
              id={`sibling_name-${index}`}
              name={`sibling_name-${index}`}
              label="Name"
              fullWidth
              variant="outlined"
              value={sibling.sibling_name}
              onChange={(e) => {
                const updatedSiblings = [...patientData.siblings];
                updatedSiblings[index].sibling_name = e.target.value;
                setPatientData({ ...patientData, siblings: updatedSiblings });
              }}
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
              id={`sibling_age-${index}`}
              name={`sibling_age-${index}`}
              label="Age"
              fullWidth
              variant="outlined"
              value={sibling.sibling_age}
              onChange={(e) => {
                const updatedSiblings = [...patientData.siblings];
                updatedSiblings[index].sibling_age = e.target.value;
                setPatientData({ ...patientData, siblings: updatedSiblings });
              }}
              sx={{
                flex: '1 1 20%',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: '1 1 30%',
              }}
            >
              <Typography> Sex: </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sibling.sibling_sex === 'Male'}
                    onChange={(e) => handleSiblingSexChange(index, e)}
                    value="Male"
                    name={`sibling_sex-${index}`}
                    color="primary"
                  />
                }
                label="Male"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sibling.sibling_sex === 'Female'}
                    onChange={(e) => handleSiblingSexChange(index, e)}
                    value="Female"
                    name={`sibling_sex-${index}`}
                    color="primary"
                  />
                }
                label="Female"
              />
              {/* Add Checkbox for "Other" if needed */}
            </Box>
          </Box>
        ))}

        <Button variant="contained" onClick={handleAddSibling} sx={{ marginTop: '16px' }}>
          Add Sibling
        </Button>

        {/* Primary Concern Section */}
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: '30',
            marginTop: '30px',
          }}
        >
          Please write your primary concern/issue about your child's speech and language skills
          (difficulties noticed in the way you child speaks, plays. understanding things, feeds and swallows, and interacts with other people)
        </Typography>
        <TextField
          required
          id="sle_concerns.speech_concern"
          name="sle_concerns.speech_concern"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          vvalue={patientData.sle_concerns.speech_concern} 
          onChange={(e) =>
            setPatientData({
              ...patientData,
              sle_concerns: {
                ...patientData.sle_concerns,
                speech_concern: e.target.value // Update as a string
              }
            })
          }
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
            },
          }}
        />

        {/* When Concern First Noticed */}
        <Box
          sx={{
            marginTop: '20px',
          }}
        >
          <Typography
            sx={{
              textAlign: 'left',
              fontSize: '30',
              marginTop: '30px',
            }}
          >
            When was the concern first noticed? who referred you to a speech pathologist?
          </Typography>
          <TextField
            required
            id="sle_concerns.concern_noticed_date"
            name="sle_concerns.concern_noticed_date"
            multiline
            rows={2}
            fullWidth
            variant="outlined"
            value={patientData.sle_concerns.concern_noticed_date}
            onChange={(e) =>
              setPatientData({
                ...patientData,
                sle_concerns: {
                  ...patientData.sle_concerns,
                  concern_noticed_date: e.target.value
                }
              })
            }
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
          />
        </Box>

        {/* Developmental History - Retain only SLP-relevant sections */}
        <Box
          sx={{
            backgroundColor: '#94C5B5',
            marginBottom: '20px',
            border: '1px solid black',
          }}
        >
          <Typography variant="h5">
            Developmental History (SLP-Relevant)
          </Typography>
        </Box>

        {/* Motor Milestones Section */}
        <Box>
          <Typography sx={{ textAlign: 'left' }}>
            A. Motor Milestones
          </Typography>
          <Typography sx={{ textAlign: 'left' }}>
            Please write the age or approximate age at which the following skills were FIRST observed:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '16px' }}>
            <TextField
              required
              label="Crawled"
              variant="outlined"
              value={patientData.sle_motor_skills.crawled_age}
              onChange={(e) => handleCheckboxChange('sle_motor_skills', 'crawled_age', e.target.value)}
              sx={{
                width: '20%',
                backgroundColor: '#FFFFFF',
                marginRight: '20px',
                borderRadius: '20px',
                '& .MuiOutlinedInput-root': { borderRadius: '20px' },
              }}
            />
            <TextField
              required
              label="Sat Alone"
              variant="outlined"
              value={patientData.sle_motor_skills.sat_alone_age}
              onChange={(e) => handleCheckboxChange('sle_motor_skills', 'sat_alone_age', e.target.value)}
              sx={{
                width: '20%',
                backgroundColor: '#FFFFFF',
                marginRight: '20px',
                borderRadius: '20px',
                '& .MuiOutlinedInput-root': { borderRadius: '20px' },
              }}
            />
            <TextField
              required
              label="Walked Unaided"
              variant="outlined"
              value={patientData.sle_motor_skills.walked_unaided_age}
              onChange={(e) => handleCheckboxChange('sle_motor_skills', 'walked_unaided_age', e.target.value)}
              sx={{
                width: '20%',
                backgroundColor:'FFFFFF',
                marginRight: '20px',
                borderRadius: '20px',
                '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                }}
                />
                <TextField
                required
                label="Fed Self"
                variant="outlined"
                value={patientData.sle_motor_skills.fed_self_age}
                onChange={(e) => handleCheckboxChange('sle_motor_skills', 'fed_self_age', e.target.value)}
                sx={{
                width: '20%',
                backgroundColor: '#FFFFFF',
                marginRight: '20px',
                borderRadius: '20px',
                '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                }}
                />
                </Box>
                
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '16px' }}>
                        <TextField
                          required
                          label="Dressed Self"
                          variant="outlined"
                          value={patientData.sle_motor_skills.dressed_self_age}
                          onChange={(e) => handleCheckboxChange('sle_motor_skills', 'dressed_self_age', e.target.value)}
                          sx={{
                            width: '20%',
                            backgroundColor: '#FFFFFF',
                            marginRight: '20px',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                          }}
                        />
                        <TextField
                          required
                          label="Toilet Trained"
                          variant="outlined"
                          value={patientData.sle_motor_skills.toilet_trained_age}
                          onChange={(e) => handleCheckboxChange('sle_motor_skills', 'toilet_trained_age', e.target.value)}
                          sx={{
                            width: '20%',
                            backgroundColor: '#FFFFFF',
                            marginRight: '20px',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                          }}
                        />
                        <TextField
                          required
                          label="Cooing"
                          variant="outlined"
                          value={patientData.sle_motor_skills.cooing_age}
                          onChange={(e) => handleCheckboxChange('sle_motor_skills', 'cooing_age', e.target.value)}
                          sx={{
                            width: '20%',
                            backgroundColor: '#FFFFFF',
                            marginRight: '20px',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                          }}
                        />
                        <TextField
                          required
                          label="Babbling"
                          variant="outlined"
                          value={patientData.sle_motor_skills.babbling_age}
                          onChange={(e) => handleCheckboxChange('sle_motor_skills', 'babbling_age', e.target.value)}
                          sx={{
                            width: '20%',
                            backgroundColor: '#FFFFFF',
                            marginRight: '20px',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                          }}
                        />
                      </Box>
                
                      {/* First Word and Sample Words */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={patientData.sle_motor_skills.said_first_word}
                              onChange={(e) => handleCheckboxChange('sle_motor_skills', 'said_first_word', e.target.checked)}
                            />
                          }
                          label="Said First Word"
                        />
                        <TextField
                          required
                          label="First Word"
                          variant="outlined"
                          value={patientData.sle_motor_skills.first_word}
                          onChange={(e) => handleCheckboxChange('sle_motor_skills', 'first_word', e.target.value)}
                          sx={{
                            width: '48%',
                            backgroundColor: '#FFFFFF',
                            marginRight: '20px',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                          }}
                        />
                        <TextField
                          required
                          label="Age"
                          variant="outlined"
                          value={patientData.sle_motor_skills.first_word_age}
                          onChange={(e) => handleCheckboxChange('sle_motor_skills', 'first_word_age', e.target.value)}
                          sx={{
                            width: '20%',
                            backgroundColor: '#FFFFFF',
                            marginRight: '20px',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                          }}
                        />
                      </Box>
                
                      {/* Understood 50 Words */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={patientData.sle_motor_skills.can_understand_50}
                              onChange={(e) => handleCheckboxChange('sle_motor_skills', 'can_understand_50', e.target.checked)}
                            />
                          }
                          label="Understood Approximately 50 Words"
                        />
                        <TextField
                          required
                          label="Age"
                          variant="outlined"
                          value={patientData.sle_motor_skills.understood_50_words_age}
                          onChange={(e) => handleCheckboxChange('sle_motor_skills', 'understood_50_words_age', e.target.value)}
                          sx={{
                            width: '20%',
                            backgroundColor: '#FFFFFF',
                            marginRight: '20px',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                          }}
                        />
                        <TextField
                          required
                          label="Sample Words"
                          variant="outlined"
                          value={patientData.sle_motor_skills.sample_understood_words}
                          onChange={(e) => handleCheckboxChange('sle_motor_skills', 'sample_understood_words', e.target.value)}
                          sx={{
                            width: '30%',
                            backgroundColor: '#FFFFFF',
                            marginRight: '20px',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                          }}
                        />
                      </Box>
                
                      {/* Expressed 50 Words */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={patientData.sle_motor_skills.expressed_50}
                              onChange={(e) => handleCheckboxChange('sle_motor_skills', 'expressed_50', e.target.checked)}
                            />
                          }
                          label="Expressed Approximately 50 Words"
                        />
                
                        <TextField
                          required
                          label="Age"
                          variant="outlined"
                          value={patientData.sle_motor_skills.expressed_50_words_age}
                          onChange={(e) => handleCheckboxChange('sle_motor_skills', 'expressed_50_words_age', e.target.value)}
                          sx={{
                            width: '20%',
                            backgroundColor: '#FFFFFF',
                            marginRight: '20px',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                          }}
                        />
                        <TextField
                          required
                          label="Sample Words"
                          variant="outlined"
                          value={patientData.sle_motor_skills.sample_expressed_words}
                          onChange={(e) => handleCheckboxChange('sle_motor_skills', 'sample_expressed_words', e.target.value)}
                          sx={{
                            width: '30%',
                            backgroundColor: '#FFFFFF',
                            marginRight: '20px',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                          }}
                        />
                      </Box>
                
                      {/* Two-Word Combinations */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={patientData.sle_motor_skills.fluent_words}
                              onChange={(e) => handleCheckboxChange('sle_motor_skills', 'fluent_words', e.target.checked)}
                            />
                          }
                          label="Said Two-Word Combinations"
                        />
                        {/* No Sample Words field for Two-Word Combinations */}
                      </Box>
                
                      {/* Short Sentences */}
                      {/* No Short Sentences or Sample Words fields in the schema */}
                      {/* Additional Motor Skills Checkboxes */}
          <FormControlLabel
            control={
              <Checkbox
                checked={patientData.sle_motor_skills.babbles}
                onChange={(e) => handleCheckboxChange('sle_motor_skills', 'babbles', e.target.checked)}
              />
            }
            label="Babbles"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={patientData.sle_motor_skills.stuttering}
                onChange={(e) => handleCheckboxChange('sle_motor_skills', 'stuttering', e.target.checked)}
              />
            }
            label="Stuttering"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={patientData.sle_motor_skills.articulation_difficulty}
                onChange={(e) => handleCheckboxChange('sle_motor_skills', 'articulation_difficulty', e.target.checked)}
              />
            }
            label="Articulation Difficulty"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={patientData.sle_motor_skills.inconsistent_voice}
                onChange={(e) => handleCheckboxChange('sle_motor_skills', 'inconsistent_voice', e.target.checked)}
              />
            }
            label="Inconsistent Voice"
          />
        </Box>

        {/* Receptive and Expressive Language Skills Section */}
        <Box>
          <Typography sx={{ textAlign: 'left' }}>
            B. Receptive and Expressive Language Skills
          </Typography>
          <Typography sx={{ textAlign: 'left' }}>
            Please answer “yes” or “no” or “sometimes” to the following questions:
          </Typography>
         {/* Question List */}
         <Box sx={{ textAlign: 'left' }}>
            {[
              '1. Does your child respond to his/her name?',
              '2. Will your child get common objects when asked?',
              '3. Does your child follow simple directions?',
              '4. Will your child point to pictures as you name them?',
              '5. Does your child name pictures?',
              '6. Does your child ask questions?',
              '7. Does your child repeat or "echo" others\' expressions?',
              '8. Does your child repeat questions or parts of questions rather than answering them?',
              '9. Does your child excessively recite/repeat words from video tape/DVDs, songs or television programs?',
              '10. Has your child said a word and few times, then never used it again?',
              '11. Did the language development seem to just stop?'
            ].map((question, index) => {
              const fieldName = Object.keys(patientData.sle_receptive_skills)[index];

              return (
                <Box key={index} sx={{ marginBottom: '16px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ flex: 1 }}>{question}</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          // Ensure 'checked' receives a boolean value
                          checked={patientData.sle_receptive_skills[fieldName] === true} 
                          onChange={(e) => handleCheckboxChange('sle_receptive_skills', fieldName, e.target.checked)}
                        />
                      }
                      label="Yes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          // Ensure 'checked' receives a boolean value
                          checked={patientData.sle_receptive_skills[fieldName] === false} 
                          onChange={(e) => handleCheckboxChange('sle_receptive_skills', fieldName, !e.target.checked)}
                        />
                      }
                      label="No"
                    />
                  </Box>

                  {/* Example TextField for question 6 */}
                  {index === 5 && patientData.sle_receptive_skills.asks_questions && (
                    <Box sx={{ marginTop: '8px', marginBottom: '16px' }}>
                      <Typography sx={{ marginBottom: '8px', textAlign: 'left' }}>Example</Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        value={patientData.sle_receptive_skills.sample_questions || ''} 
                        onChange={(e) => handleCheckboxChange('sle_receptive_skills', 'sample_questions', e.target.value)}
                        sx={{ backgroundColor: '#FFFFFF', borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                      />
                    </Box>
                  )}

                  {index === 7 && patientData.sle_receptive_skills.repeats_expressions && (
                    <Box sx={{ marginTop: '8px', marginBottom: '16px' }}>
                      <Typography sx={{ marginBottom: '8px', textAlign: 'left' }}>Example</Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        value={patientData.sle_receptive_skills.sample_repeated_expressions || ''} 
                        onChange={(e) => handleCheckboxChange('sle_receptive_skills', 'sample_repeated_expressions', e.target.value)}
                        sx={{ backgroundColor: '#FFFFFF', borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                      />
                    </Box>
                  )}

                  {/* Conditional fields for questions 9 and 10 */}
                  {index === 8 && patientData.sle_receptive_skills.excessively_recites_words && (
                    <Box sx={{ display: 'flex', marginBottom: '16px' }}>
                      <Typography sx={{ marginRight: '16px' }}>If "yes, when?"</Typography>
                      <TextField
                        variant="outlined"
                        value={patientData.sle_receptive_skills.excessively_recites_words_date || ''} 
                        onChange={(e) => handleCheckboxChange('sle_receptive_skills', 'excessively_recites_words_date', e.target.value)}
                        sx={{ flex: 1, marginRight: '16px', backgroundColor: '#FFFFFF', borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                      />
                      <Typography sx={{ marginRight: '16px' }}>What words?</Typography>
                      <TextField
                        variant="outlined"
                        fullWidth 
                        sx={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                      />
                    </Box>
                  )}

                  {index === 9 && patientData.sle_receptive_skills.said_word_then_stopped_using && (
                    <Box sx={{ display: 'flex', marginBottom: '16px' }}>
                      <Typography sx={{ marginRight: '16px' }}>If "yes, when?"</Typography>
                      <TextField
                        variant="outlined"
                        value={patientData.sle_receptive_skills.said_word_then_stopped_using_date || ''} 
                        onChange={(e) => handleCheckboxChange('sle_receptive_skills', 'said_word_then_stopped_using_date', e.target.value)}
                        sx={{ flex: 1, marginRight: '16px', backgroundColor: '#FFFFFF', borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                      />
                      <Typography sx={{ marginRight: '16px' }}>What words?</Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        sx={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                      />
                    </Box>
                  )}

                  {index === 10 && patientData.sle_receptive_skills.language_development_stopped && (
                    <Box sx={{ marginBottom: '16px' }}>
                      <Typography sx={{ marginBottom: '8px' }}>If "yes", When? Describe</Typography>
                      <TextField
                        variant="outlined"
                        value={patientData.sle_receptive_skills.language_development_stopped_date || ''}
                        onChange={(e) => handleCheckboxChange('sle_receptive_skills', 'language_development_stopped_date', e.target.value)}
                        fullWidth 
                        sx={{ backgroundColor: '#FFFFFF', borderRadius: '20px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                      />
                    </Box>
                  )}
                </Box>
              );
            })}

  
        </Box>

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
      </Box>
      </form>
    </Box>
  );
};

export default AssessmentForm;