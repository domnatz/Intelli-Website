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

export default function PatientInfoForm() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [showAssignAlert, setShowAssignAlert] = useState(false);
// State variables for the form fields
const [selfAware, setSelfAware] = useState(null);
const [lessonEngagement, setLessonEngagement] = useState(null);
const [improvementState, setImprovementState] = useState(null);
const [errorFrequency, setErrorFrequency] = useState(null);
const [progressQuality, setProgressQuality] = useState(null);
const [remarks, setRemarks] = useState(null);
const [progressScore, setProgressScore] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);


  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/patients/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          return data; // Return patient data
        } else {
          console.error("Error fetching patient:", response.status);
          return null; // Return null on error
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
        return null; // Return null on error
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

    fetchPatient()
      .then((patientData) => {
        if (patientData) {
          setPatient(patientData);
          fetchLessons();
        } else {
          console.error("Failed to fetch patient data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching patient:", error);
      });
  }, [patientId]);

  if (!patient) {
    return <div>Loading patient data...</div>;
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
              label="Additional Notes"
              multiline
              rows={3}
              sx={{ marginTop: "16px" }}
            />
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
            </Box>

            <TextField
              fullWidth
              label="Remarks"
              multiline
              rows={3}
              sx={{ marginTop: "16px" }}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <TextField
              fullWidth
              label="Recommendation Reason"
              multiline
              rows={3}
              sx={{ marginTop: "16px" }}
            />

            <FormControl component="fieldset" sx={{ marginTop: "25px" }}>
              <FormLabel component="legend">
                Is the patient ready to proceed to the next lesson?
              </FormLabel>
              <RadioGroup row>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No"   
 />
              </RadioGroup>
            </FormControl>

            <Button type="submit"   
 variant="contained" sx={{ marginTop: "16px" }}>
              Submit Progress
            </Button>
          </Box>
        </Grid>
        {/* Lesson Recommendations Section */}
        <Grid item xs={12} md={4}> 
  <Box
    sx={{
      border: "1px solid #ccc",
      padding: "16px",
      borderRadius: "8px",
      backgroundColor: "#fff",
      boxShadow: 3,
      marginBottom: "16px", 
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
      Lesson Recommendations:
    </Typography>
    <TextField
      fullWidth
      label="Lesson"
      sx={{ marginTop: "16px" }}
      InputLabelProps={{ shrink: true }}
    />
    <TextField
      fullWidth
      label="Complexity"
      sx={{ marginTop: "16px" }}
      InputLabelProps={{ shrink: true }}
    />
    <TextField
      fullWidth
      label="Lesson Description"
      multiline
      rows={3}
      sx={{ marginTop: "16px" }}
      InputLabelProps={{ shrink: true }}
    />
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