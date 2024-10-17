import { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import "./ProgressReport.css";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  MenuItem, 
  FormLabel,
  Select,
  Alert,
  InputLabel,
} from "@mui/material";
import Sidebar from "./Sidebar";

async function recommendLessons(patient, lessons) {
  const recommendedLessons = [];

  // Log the entire lessons array to inspect its structure
  console.log("All Lessons:", lessons);

  // Log each lesson to inspect its structure
  lessons.forEach((lesson, index) => {
    console.log(`Lesson ${index + 1}:`, lesson);
  });

  // Fetch lessons by category
  const schoolSkillsLessons = lessons.filter((lesson) => {
    if (lesson && lesson.lesson_category) {
      return lesson.lesson_category.trim().toLowerCase() === "school skills";
    }
    return false;
  });
  const physicalTasksLessons = lessons.filter((lesson) => {
    if (lesson && lesson.lesson_category) {
      return lesson.lesson_category.trim().toLowerCase() === "physical tasks";
    }
    return false;
  });
  const receptiveSkillsLessons = lessons.filter((lesson) => {
    if (lesson && lesson.lesson_category) {
      return lesson.lesson_category.trim().toLowerCase() === "receptive skills";
    }
    return false;
  });
  const motorSkillsLessons = lessons.filter((lesson) => {
    if (lesson && lesson.lesson_category) {
      return lesson.lesson_category.trim().toLowerCase() === "motor skills";
    }
    return false;
  });

  console.log("School Skills Lessons:", schoolSkillsLessons);
  console.log("Physical Tasks Lessons:", physicalTasksLessons);
  console.log("Receptive Skills Lessons:", receptiveSkillsLessons);
  console.log("Motor Skills Lessons:", motorSkillsLessons);

  // School Skills Tally and Recommendations
  let schoolSkillsTally = 0;
  let schoolSkillsLesson = null;

  if (patient.school_skills?.problems_in_school_activities) schoolSkillsTally++;
  if (patient.school_skills?.problems_with_academics) schoolSkillsTally++;
  if (patient.school_skills?.focusing_school_problem) schoolSkillsTally++;

  console.log("School Skills Tally:", schoolSkillsTally);

  if (schoolSkillsTally >= 3) {
    schoolSkillsLesson = schoolSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "hard";
      }
      return false;
    });
  } else if (schoolSkillsTally >= 1) {
    schoolSkillsLesson = schoolSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "easy";
      }
      return false;
    });
  }

  console.log("Filtered School Skills Lessons:", schoolSkillsLesson);

  if (schoolSkillsLesson) {
    recommendedLessons.push(...schoolSkillsLesson);
  }

  // Physical Tasks Tally and Recommendations
  let physicalTasksTally = 0;
  let physicalTasksLesson = null;

  if (patient.physical_tasks?.performing_physical_tasks) physicalTasksTally++;
  if (patient.physical_tasks?.complying_with_directives) physicalTasksTally++;
  if (patient.physical_tasks?.communicating_with_others) physicalTasksTally++;
  if (patient.physical_tasks?.taking_care_of_himself) physicalTasksTally++;
  if (patient.physical_tasks?.interacting_with_others) physicalTasksTally++;
  if (patient.physical_tasks?.feeding_problem) physicalTasksTally++;
  if (patient.physical_tasks?.dressing_problem) physicalTasksTally++;
  if (patient.physical_tasks?.walking_problem) physicalTasksTally++;
  if (patient.physical_tasks?.bathroom_problem) physicalTasksTally++;

  console.log("Physical Tasks Tally:", physicalTasksTally);

  if (physicalTasksTally >= 3) {
    physicalTasksLesson = physicalTasksLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "hard";
      }
      return false;
    });
  } else if (physicalTasksTally >= 1) {
    physicalTasksLesson = physicalTasksLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "easy";
      }
      return false;
    });
  }

  console.log("Filtered Physical Tasks Lessons:", physicalTasksLesson);

  if (physicalTasksLesson) {
    recommendedLessons.push(...physicalTasksLesson);
  }

  // Receptive Skills Tally and Recommendations
  let receptiveSkillsTally = 0;
  let receptiveSkillsLesson = null;

  if (patient.sle_receptive_skills?.responds_to_name) receptiveSkillsTally++;
  if (patient.sle_receptive_skills?.gets_common_objects) receptiveSkillsTally++;
  if (patient.sle_receptive_skills?.follows_simple_directions) receptiveSkillsTally++;
  if (patient.sle_receptive_skills?.points_to_pictures) receptiveSkillsTally++;
  if (patient.sle_receptive_skills?.names_pictures) receptiveSkillsTally++;
  if (patient.sle_receptive_skills?.asks_questions) receptiveSkillsTally++;
  if (patient.sle_receptive_skills?.repeats_expressions) receptiveSkillsTally++;
  if (patient.sle_receptive_skills?.repeats_questions_instead_of_answering) receptiveSkillsTally++;
  if (patient.sle_receptive_skills?.excessively_recites_words) receptiveSkillsTally++;
  if (patient.sle_receptive_skills?.said_word_then_stopped_using) receptiveSkillsTally++;
  if (patient.sle_receptive_skills?.language_development_stopped) receptiveSkillsTally++;

  console.log("Receptive Skills Tally:", receptiveSkillsTally);

  if (receptiveSkillsTally >= 3) {
    receptiveSkillsLesson = receptiveSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "hard";
      }
      return false;
    });
  } else if (receptiveSkillsTally >= 1) {
    receptiveSkillsLesson = receptiveSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "easy";
      }
      return false;
    });
  }

  console.log("Filtered Receptive Skills Lessons:", receptiveSkillsLesson);

  if (receptiveSkillsLesson) {
    recommendedLessons.push(...receptiveSkillsLesson);
  }

  // Motor Skills Tally and Recommendations
  let motorSkillsTally = 0;
  let motorSkillsLesson = null;

  if (patient.sle_motor_skills?.babbles) motorSkillsTally++;
  if (patient.sle_motor_skills?.said_first_word) motorSkillsTally++;
  if (patient.sle_motor_skills?.can_understand_50) motorSkillsTally++;
  if (patient.sle_motor_skills?.expressed_50) motorSkillsTally++;
  if (patient.sle_motor_skills?.fluent_words) motorSkillsTally++;
  if (patient.sle_motor_skills?.stuttering) motorSkillsTally++;
  if (patient.sle_motor_skills?.articulation_difficulty) motorSkillsTally++;
  if (patient.sle_motor_skills?.inconsistent_voice) motorSkillsTally++;

  console.log("Motor Skills Tally:", motorSkillsTally);

  if (motorSkillsTally >= 3) {
    motorSkillsLesson = motorSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "hard";
      }
      return false;
    });
  } else if (motorSkillsTally >= 1) {
    motorSkillsLesson = motorSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "easy";
      }
      return false;
    });
  }

  console.log("Filtered Motor Skills Lessons:", motorSkillsLesson);

  if (motorSkillsLesson) {
    recommendedLessons.push(...motorSkillsLesson);
  }

  console.log("Final Recommended Lessons:", recommendedLessons);

  return recommendedLessons;
}
export default function PatientInfoForm() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [showAssignAlert, setShowAssignAlert] = useState(false);

  const [selfAware, setSelfAware] = useState(null);
  const [lessonEngagement, setLessonEngagement] = useState(null);
  const [improvementState, setImprovementState] = useState(null);
  const [errorFrequency, setErrorFrequency] = useState(null);
  const [progressQuality, setProgressQuality] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const [progressScore, setProgressScore] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/patients/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          console.error("Error fetching patient:", response.status);
          return null;
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
        return null;
      }
    };

    const fetchLessons = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/lessons`);
        if (response.ok) {
          const data = await response.json();
          setLessons(data);
        } else {
          console.error("Error fetching lessons:", response.status);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    async function fetchData() {
      const patientData = await fetchPatient();

      if (patientData) {
        setPatient(patientData);
        await fetchLessons();
      } else {
        console.error("Failed to fetch patient data.");
      }
    }

    fetchData ();
  }, [patientId]);

  // This useEffect will run whenever the 'lessons' state changes
  useEffect(() => {
    if (patient && lessons.length > 0) {
      recommendLessons(patient, lessons)
        .then((recommendations) => {
          console.log("Recommendations generated:", recommendations);
          setRecommendations(recommendations);
        })
        .catch((error) => {
          console.error("Error generating recommendations:", error);
        });
    }
  }, [lessons, patient]);

  if (!patient) {
    return <div>Loading patient data...</div>;
  }
  const handleDeleteLesson = async (lessonId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/patients/${patientId}/assigned-lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update the patient state or show a success message
        const updatedPatient = await response.json();
        setPatient(updatedPatient); // Update the patient data in state
      } else {
        console.error('Error deleting assigned lesson:', response.status);
      }
    } catch (error) {
      console.error('Error deleting assigned lesson:', error);
    }
  };

  
  const handleSubmitProgress = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("self_aware", selfAware === "true");
      formData.append("lesson_engagement", lessonEngagement);
      formData.append("improvement_state", improvementState);
      formData.append("error_frequency", errorFrequency);
      formData.append("progress_quality", progressQuality);
      formData.append("remarks", remarks);
      formData.append("progress_score", progressScore);
      if (selectedFile) {
        formData.append("report_file", selectedFile);
      }

      const response = await fetch(`/api/patients/${patientId}/progress`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Progress updated successfully!");
      } else {
        console.error("Error updating progress:", response.status);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleAssignLesson = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/patients/${patientId}/assign-lesson`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonId: selectedLesson,
            lesson_name: lessons.find(
              (lesson) => lesson._id === selectedLesson
            )?.lesson_name,
            lesson_complexity: lessons.find(
              (lesson) => lesson._id === selectedLesson
            )?.lesson_complexity,
            lesson_category: lessons.find(
              (lesson) => lesson._id === selectedLesson
            )?.lesson_category,
            lesson_desc: lessons.find(
              (lesson) => lesson._id === selectedLesson
            )?.lesson_desc,
          }),
        }
      );

      if (response.ok) {
        setShowAssignAlert(true);

        setTimeout(() => {
          setShowAssignAlert(false);
        }, 3000);
      } else {
        console.error("Error assigning lesson:", response.status);
      }
    } catch (error) {
      console.error("Error assigning lesson:", error);
    }
  
  };

  return (
    
    <Box sx={{ display: "flex", padding: "20px" }}>
      <Sidebar />
      <Box
        sx={{
          padding: "20px",
          flexGrow: 1,
          marginTop: "-20px",
          color: "#3F4662",
          fontFamily: "Inter, sans-serif",
          marginLeft: "280px",
        }}
      >{/* Alert for Assign Lesson Success */}
      {showAssignAlert && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Lesson assigned successfully!
            </Alert>
          )}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                border: "1px solid #ccc",
                fontFamily: "Inter, sans-serif",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "5px",
                backgroundColor: "#fff",
                boxShadow: 3,
              }}
            >
              <Typography>Patient Name: {patient.patient_name}</Typography>
              <Typography>Age: {patient.patient_age}</Typography>
              <Typography>Gender: {patient.patient_sex}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
  <Box
    sx={{
      border: "1px solid #ccc",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "5px",
      backgroundColor: "#fff",
      boxShadow: 3,
    }}
  >
  <Typography variant="h6">Current Lessons</Typography>
{patient.assignedLessons.map((lesson) => (
  <div key={lesson._id} style={{ display: 'flex', alignItems: 'center' }}>
    <div> {/* Wrap the lesson details in a div */}
      <Typography>Lesson Name: {lesson.lesson_name}</Typography>
      <Typography>Lesson Complexity: {lesson.lesson_complexity}</Typography>
      <Typography>Lesson Category: {lesson.lesson_category}</Typography>
      <Typography>Lesson Description: {lesson.lesson_desc}</Typography>
    </div>
    <Button
      variant="contained"
      color="error"
      size="small"
      onClick={() => handleDeleteLesson(lesson.lessonId)}
      sx={{ marginLeft: '120px', maxWidth: '80px', }} // Add margin to separate the button
    >
      DISMISS
    </Button>
  </div>
))}
  </Box>
</Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginTop: "5px" }}>
        <Grid item xs={12} md={8}>
          <Box
            component="form"
            onSubmit={handleSubmitProgress}
            sx={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: 3,
            }}
          >
            <Typography variant="h6">Observations:</Typography>

            {/* Self Awareness */}
            <FormControl component="fieldset" sx={{ marginTop: "18px", marginLeft: "20px" }}>
              <FormLabel component="legend">Self Awareness:</FormLabel>
              <RadioGroup
                row
                value={selfAware}
                onChange={(e) => setSelfAware(e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>   

            </FormControl>

            {/* Lesson Engagement */}
            <FormControl component="fieldset" sx={{ marginTop: "18px", marginLeft: "250px" }}>
              <FormLabel component="legend">Lesson Engagement:</FormLabel>
              <RadioGroup
                row
                value={lessonEngagement}
                onChange={(e) => setLessonEngagement(e.target.value)}
              >
                <FormControlLabel value="high" control={<Radio />} label="High" />
                <FormControlLabel
                  value="medium"
                  control={<Radio />}
                  label="Medium"
                />
                <FormControlLabel   
 value="low" control={<Radio />} label="Low" />
              </RadioGroup>
            </FormControl>   


            {/* Improvement State */}
            <FormControl component="fieldset" sx={{ marginTop: "18px", marginLeft: "20px" }}>
              <FormLabel component="legend">Improvement State:</FormLabel>
              <RadioGroup
                row
                value={improvementState}
                onChange={(e) => setImprovementState(e.target.value)}
              >
                <FormControlLabel
                  value="improving"
                  control={<Radio />}
                  label="Improving"
                />
                <FormControlLabel value="stable" control={<Radio />} label="Stable" />
                <FormControlLabel
                  value="not improving"
                  control={<Radio />}
                  label="Not improving"
                />
              </RadioGroup>
            </FormControl>

            {/* Error Frequency */}
            <FormControl component="fieldset" sx={{ marginTop: "18px", marginLeft: "30px" }}>
              <FormLabel component="legend">Error Frequency:</FormLabel>
              <RadioGroup
                row
                value={errorFrequency}
                onChange={(e) => setErrorFrequency(e.target.value)}
              >
                <FormControlLabel value="never" control={<Radio />} label="Never" />
                <FormControlLabel
                  value="sometimes"
                  control={<Radio />}
                  label="Sometimes"
                />
                <FormControlLabel value="always" control={<Radio />} label="always" />
              </RadioGroup>
            </FormControl>

            {/* Progress Quality */}
            <FormControl component="fieldset" sx={{ marginTop: "18px", marginLeft: "20px" }}>
              <FormLabel component="legend">Progress Quality:</FormLabel>
              <RadioGroup
                row
                value={progressQuality}
                onChange={(e) => setProgressQuality(e.target.value)}
              >
                <FormControlLabel
                  value="excellent"
                  control={<Radio />}
                  label="Excellent"
                />
                <FormControlLabel value="good" control={<Radio />} label="Good" />
                <FormControlLabel value="poor"   
 control={<Radio />} label="Poor" />
              </RadioGroup>
            </FormControl>

            <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={3}
                sx={{ marginTop: "16px" }}
                value={remarks || ""} // Ensure 'remarks' is always a string
                onChange={(e) => setRemarks(e.target.value)}
              />

              {/* Lesson Completion Section */}
              <Box
                sx={{
                  border: '1px solid #ccc',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: 3,
                  marginTop: '16px',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Lesson Completion
                </Typography>
                <Typography variant="body1" sx={{ marginTop: '8px' }}>
                  {/* This text will be generated later */}
                  Lesson completion details will be displayed here.
                </Typography>
              </Box>

              <FormControl component="fieldset" sx={{ marginTop: "25px" }}>
                <FormLabel component="legend">
                  Is the patient ready to proceed to the next lesson?
                </FormLabel>
                <RadioGroup row>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
<br/>
              <Button type="submit" variant="contained" sx={{ marginTop: "56px", marginLeft: "20px", backgroundColor: "#2D848B", color: "#fff"
              }}>
                Submit Progress
              </Button>
          </Box>
        </Grid>
        {/* Lesson Recommendations Section */}
        <Grid item xs={12} md={4}>
  <Box
    sx={{
      border: '1px solid #ccc',
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: 3,
      marginBottom: '16px',
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
      Lesson Recommendations:
    </Typography>

    {/* Display recommended lessons */}
    {recommendations.map((lesson, index) => (
      <div key={index}>
        <Typography>
          This patient might need to take the lesson <b>{lesson.lesson_name}</b>.
        </Typography>
        {/* You can include additional details if needed */}
         <Typography>Complexity: {lesson.lesson_complexity}</Typography>
        <Typography>Category: {lesson.lesson_category}</Typography>
        <Typography>Description: {lesson.lesson_desc}</Typography> 
      </div>
    ))}
  </Box>

  <Box
    sx={{
      border: "1px solid #ccc",
      padding: "16px",
      borderRadius: "8px",
      backgroundColor: "#fff",
      boxShadow: 3,
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
      Assign Lesson:
    </Typography>
    <FormControl fullWidth sx={{ marginTop: "16px" }}>
        <InputLabel shrink>Lessons</InputLabel>
        <Select
          value={selectedLesson}
          onChange={(e) => setSelectedLesson(e.target.value)}
          displayEmpty
        >
          {lessons.map((lesson) => ( 
            <MenuItem key={lesson._id} value={lesson._id}>
              {lesson.lesson_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#2D848B",
          color: "#fff",
          alignItems: "center",
        }}
        onClick={handleAssignLesson} // Call the 'handleAssignLesson' function here
      >
        Assign
      </Button>
    </Box>
  </Box>
</Grid> 
        </Grid>
      </Box>
    </Box>
  );
}