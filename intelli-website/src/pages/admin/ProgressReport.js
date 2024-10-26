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
  CircularProgress,
} from "@mui/material";
import Sidebar from "./Sidebar";

async function recommendLessons(patient, lessons) {
  const recommendedLessons = [];
  // Log each lesson to inspect its structure
  lessons.forEach((lesson, index) => {
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

  // School Skills Tally and Recommendations
  let schoolSkillsTally = 0;
  let schoolSkillsLesson = null;

  if (patient.school_skills?.problems_in_school_activities) schoolSkillsTally++;
  if (patient.school_skills?.problems_with_academics) schoolSkillsTally++;
  if (patient.school_skills?.focusing_school_problem) schoolSkillsTally++;

  if (schoolSkillsTally >= 3) {
    schoolSkillsLesson = schoolSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "hard";
      }
      return false;
    });
  } else if (schoolSkillsTally >= 1.5) {
    schoolSkillsLesson = schoolSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "medium";
      }
      return false;
    });
  } else if (schoolSkillsTally >= 0.7) {
    schoolSkillsLesson = schoolSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "easy";
      }
      return false;
    });
  }

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

  if (physicalTasksTally >= 3) {
    physicalTasksLesson = physicalTasksLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "hard";
      }
      return false;
    });
  } else if (physicalTasksTally >= 1.5) {
    physicalTasksLesson = physicalTasksLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "medium";
      }
      return false;
    });
  } else if (physicalTasksTally >= 0.7) {
    physicalTasksLesson = physicalTasksLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "easy";
      }
      return false;
    });
  }

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

  if (receptiveSkillsTally >= 3) {
    receptiveSkillsLesson = receptiveSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "hard";
      }
      return false;
    });
  } else if (receptiveSkillsTally >= 1.5) {
    receptiveSkillsLesson = receptiveSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "medium";
      }
      return false;
    });
  } else if (receptiveSkillsTally >= 0.7) {
    receptiveSkillsLesson = receptiveSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "easy";
      }
      return false;
    });
  }

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

  if (motorSkillsTally >= 3) {
    motorSkillsLesson = motorSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "hard";
      }
      return false;
    });
  } else if (motorSkillsTally >= 1.5) {
    motorSkillsLesson = motorSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "medium";
      }
      return false;
    });
  } else if (motorSkillsTally >= 0.7) {
    motorSkillsLesson = motorSkillsLessons.filter((lesson) => {
      if (lesson && lesson.lesson_complexity) {
        return lesson.lesson_complexity.trim().toLowerCase() === "easy";
      }
      return false;
    });
  }

  if (motorSkillsLesson) {
    recommendedLessons.push(...motorSkillsLesson);
  }

  return recommendedLessons;
}
export default function PatientInfoForm() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [showAssignAlert, setShowAssignAlert] = useState(false);

  const [selfAware, setSelfAware] = useState(null); // Initialize with null or a default value
  const [lessonEngagement, setLessonEngagement] = useState(null); // Initialize with null or a default value
  const [improvementState, setImprovementState] = useState(null); // Initialize with null or a default value
  const [errorFrequency, setErrorFrequency] = useState(null); // Initialize with null or a default value
  const [progressQuality, setProgressQuality] = useState(null); // Initialize with null or a default value
  const [remarks, setRemarks] = useState(""); // Initialize with an empty string
  const [progressScore, setProgressScore] = useState(null); // Initialize with null or a default value
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [lessonCompletion, setLessonCompletion] = useState('');
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
 // Fetch progress score when the component mounts
 useEffect(() => {
  const fetchProgressScore = async () => {
    try {
      const response = await fetch(`${process.env.REACT_BACKEND_API}/api/patients/${patientId}/progress`);
      const data = await response.json();
      // Assuming the response contains an array of progress reports
      if (data.length > 0) {
        // Get the latest progress report
        const latestProgressReport = data[data.length - 1];
        setProgressScore(Number(latestProgressReport.progress_score));
      } else {
        setProgressScore(null);
      }
    } catch (error) {
      console.error('Error fetching progress score:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProgressScore();
}, [patientId]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/patients/${patientId}`);
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
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/lessons`);
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
       // Simulate a delay before hiding the loader
       setTimeout(() => {
        setLoadingRecommendations(false);
      }, 2000); 
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
    return ( 
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' // Take full viewport height 
      }}>
        <CircularProgress /> 
      </div>
    );
  }
  const handleDeleteLesson = async (lessonId) => {
    try {
      const response = await fetch(`${process.env.REACT_BACKEND_API}/api/patients/${patientId}/assigned-lessons/${lessonId}`, {
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

    // Initialize progressScore
    let progressScore = 0;

    try {
        const formData = new FormData();

      // Use consistent string values for boolean fields
      formData.append("self_aware", selfAware === "true" ? "true" : "false"); 

      formData.append("lesson_engagement", lessonEngagement || "");
      formData.append("improvement_state", improvementState || "");
      formData.append("error_frequency", errorFrequency || "");
      formData.append("progress_quality", progressQuality || "");
      formData.append("remarks", remarks || "");
        // Calculate progress score
        if (selfAware === "true") progressScore += 20;

        if (lessonEngagement === "high") progressScore += 30;
        else if (lessonEngagement === "medium") progressScore += 20;
        else if (lessonEngagement === "low") progressScore += 10;

        if (improvementState === "improving") progressScore += 30;
        else if (improvementState === "stable") progressScore += 20;
        else if (improvementState === "not improving") progressScore += 10;

        if (errorFrequency === "never") progressScore += 20;
        else if (errorFrequency === "sometimes") progressScore += 10;

        if (progressQuality === "excellent") progressScore += 20;
        else if (progressQuality === "good") progressScore += 10;

        // Append calculated progress score
        formData.append("progress_score", progressScore);

        // Append the file (if any)
        if (selectedFile) {
            formData.append("report_file", selectedFile);
        }

        // Send form data via POST request
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/patients/${patientId}/progress`, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
             // Show success alert
      setShowSubmitAlert(true);

      // Clear form fields
      setSelfAware(null);
      setLessonEngagement(null);
      setImprovementState(null);
      setErrorFrequency(null);
      setProgressQuality(null);
      setRemarks("");
      setSelectedFile(null);

      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowSubmitAlert(false);
      }, 3000);
        } else {
            console.error("Error updating progress:", response.status);
            // Optional: Display an error message to the user
        }
    } catch (error) {
        console.error("Error updating progress:", error);
        // Optional: Handle errors, e.g., display a notification or error message
    }
    setProgressScore(progressScore);
};


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAssignLesson = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_BACKEND_API}/api/patients/${patientId}/assign-lesson`,
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

        // Fetch updated patient data
        const updatedPatient = await fetch(`${process.env.REACT_BACKEND_API}/api/patients/${patientId}`);
        const updatedPatientData = await updatedPatient.json();
        setPatient(updatedPatientData);
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

          {/* Alert for Submit Progress Success */}
        {showSubmitAlert && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Progress submitted successfully!
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
            <FormControl component="fieldset" sx={{ marginTop: "18px" }}>
  <FormLabel component="legend">Self Aware:</FormLabel>
  <RadioGroup row value={selfAware} onChange={(e) => setSelfAware(e.target.value)}>
    <FormControlLabel value="true" control={<Radio />} label="Yes" />
    <FormControlLabel value="false" control={<Radio />} label="No" />
  </RadioGroup>   
</FormControl>
<br />
{/* Lesson Engagement */}
<FormControl component="fieldset" sx={{ marginTop: "18px" }}>
  <FormLabel component="legend">Lesson Engagement:</FormLabel>
  <RadioGroup row value={lessonEngagement} onChange={(e) => setLessonEngagement(e.target.value)}>
    <FormControlLabel value="high" control={<Radio />} label="High" />
    <FormControlLabel value="medium" control={<Radio />} label="Medium" />
    <FormControlLabel value="low" control={<Radio />} label="Low" />
  </RadioGroup>
</FormControl>   
<br/>

{/* Improvement State */}
<FormControl component="fieldset" sx={{ marginTop: "18px" }}>
  <FormLabel component="legend">Improvement State:</FormLabel>
  <RadioGroup row value={improvementState} onChange={(e) => setImprovementState(e.target.value)}>
    <FormControlLabel value="improving" control={<Radio />} label="Improving" />
    <FormControlLabel value="stable" control={<Radio />} label="Stable" />
    <FormControlLabel value="not improving" control={<Radio />} label="Not improving" />
  </RadioGroup>
</FormControl>
<br/>
{/* Error Frequency */}
<FormControl component="fieldset" sx={{ marginTop: "18px" }}>
  <FormLabel component="legend">Error Frequency:</FormLabel>
  <RadioGroup row value={errorFrequency} onChange={(e) => setErrorFrequency(e.target.value)}>
    <FormControlLabel value="never" control={<Radio />} label="Never" />
    <FormControlLabel value="sometimes" control={<Radio />} label="Sometimes" />
    <FormControlLabel value="always" control={<Radio />} label="always" />
  </RadioGroup>
</FormControl>
<br/>
{/* Progress Quality */}
<FormControl component="fieldset" sx={{ marginTop: "18px" }}>
  <FormLabel component="legend">Progress Quality:</FormLabel>
  <RadioGroup row value={progressQuality} onChange={(e) => setProgressQuality(e.target.value)}>
    <FormControlLabel value="excellent" control={<Radio />} label="Excellent" />
    <FormControlLabel value="good" control={<Radio />} label="Good" />
    <FormControlLabel value="poor"   
 control={<Radio />} label="Poor" />
  </RadioGroup>
</FormControl>
<br/>
           <Box
      sx={{
        border: "1px dashed #ccc",
        padding: "16px",
        textAlign: "center",
        borderRadius: "8px",
        marginTop: "16px",
      }}
    >
      <Typography>Click to Upload</Typography>
      <Button
        variant="outlined"
        component="label"
        sx={{ marginTop: "16px" }}
      >
        Upload
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {/* Display the filename */}
      {selectedFile && (
        <Typography variant="body2" sx={{ marginTop: "8px" }}>
          Selected file: {selectedFile.name}
        </Typography>
      )}
    </Box>
    <TextField
  fullWidth
  label="Remarks"
  multiline
  rows={3}
  sx={{ marginTop: "16px" }}
  value={remarks || ""}
  onChange={(e) => setRemarks(e.target.value)}
/>
              {/* Lesson Completion Section */}
              <Box
  sx={{
    border: "1px solid #ccc",
    padding: "16px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: 3,
    marginTop: "16px",
  }}
>
  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
    Lesson Progession
  </Typography>
  <Typography variant="body1" sx={{ marginTop: "8px" }}>
    {progressScore === null
      ? "No observations recorded yet."
      : progressScore >= 70
      ? "Patient may proceed to the next lesson."
      : "Patient needs more practice on the current lesson."}
  </Typography>
  </Box>

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
 {/* Conditionally render loading indicator or recommendations */}
 {loadingRecommendations ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ marginLeft: "10px" }}>
                Generating recommendations...
              </Typography>
            </div>
          ) : (
            recommendations.map((lesson, index) => (
              <div key={index}>
        <Typography>
          This patient might need to take the lesson <b>{lesson.lesson_name}</b>.
        </Typography>
        {/* You can include additional details if needed */}
         <Typography>Complexity: {lesson.lesson_complexity}</Typography>
        <Typography>Category: {lesson.lesson_category}</Typography>
        <Typography>Description: {lesson.lesson_desc}</Typography> 
      </div>
      ))
    )}
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
