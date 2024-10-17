import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  IconButton,
  Alert,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from "@mui/material";

// Modal styling (copied exactly from your AddLessonForm example)
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

export default function Lessons() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);

  const [newLessonName, setNewLessonName] = useState('');
  const [newComplexity, setNewComplexity] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTherapyType, setNewTherapyType] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false); 

  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`${process.env.REACT_BACKEND_API}/api/lessons`);
        if (response.ok) {
          const data = await response.json();
          setRows(data);
        } else {
          console.error("Error fetching lessons:", response.status);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();
  }, []);

  const handleAddLesson = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_BACKEND_API}/api/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lesson_name: newLessonName,
          lesson_complexity: newComplexity,
          lesson_category: newCategory,   // Make sure this is set correctly
          lesson_desc: newDescription,
          therapy_type: newTherapyType,   // Make sure this is set correctly
        }),
      });

      if (response.ok) {
        const newLesson = await response.json();
        setRows([...rows, newLesson]);

        setNewLessonName("");
        setNewComplexity("");
        setNewCategory("");
        setNewDescription("");
        setOpen(false);

        // Show success alert
        setShowSuccessAlert(true);

        // Hide alert after a few seconds (optional)
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000); // Hide after 3 seconds
      } else {
        const errorData = await response.json();
        console.error("Error adding lesson:", errorData);
      }
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  const handleDeleteLesson = async (rowIndex) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) try {
      const lessonId = rows[rowIndex]._id; 
  
      const response = await fetch(`${process.env.REACT_BACKEND_API}/api/lessons/${lessonId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Refresh lessons from the database after deletion
        const updatedLessons = await response.json(); 
        setRows(updatedLessons); 
        setShowDeleteAlert(true);

        // Hide alert after a few seconds (optional)
        setTimeout(() => {
          setShowDeleteAlert(false);
        }, 3000); // Hide after 3 seconds
      } else {
        const errorData = await response.json();
        console.error('Error deleting lesson:', errorData);
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          padding: "30px",
          marginLeft: "280px",
          transition: "margin 0.3s ease",
        }}
      >
        {/* Success Alert */}
        {showSuccessAlert && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Lesson added successfully!
          </Alert>
        )}

         {/* Success Alert for Deleting */}
      {showDeleteAlert && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Lesson deleted successfully!
        </Alert>
      )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2D848B", color: "#fff" }}
            startIcon={<AddIcon />}
            onClick={handleModalOpen}
          >
            Add New Lessons
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: "8px", boxShadow: 3, overflowX: "auto" }}
        >
          <Table aria-label="lessons table" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#3F4662" }}>
                  Lesson Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3F4662" }}>
                  Lesson Complexity
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3F4662" }}>
                  Lesson Category
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3F4662" }}>
                  Lesson Description
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.lesson_name}</TableCell>
                  <TableCell>{row.lesson_complexity}</TableCell>
                  <TableCell>{row.lesson_category}</TableCell>
                  <TableCell>{row.lesson_desc}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
  <Button 
    variant="contained" 
    color="error" 
    onClick={() => handleDeleteLesson(index)} 
    sx={{ 
      backgroundColor: '#D14D4D', 
      borderRadius: '18px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginLeft: '10px',
      marginTop: '10px',
      '&:hover': { backgroundColor: '#E79E9E' } 
    }}
  >
    Delete
  </Button>
</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal open={open} onClose={handleModalClose}>
          <Box sx={modalStyle}>
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ marginBottom: "20px" }}
            >
              Add Lesson
            </Typography>
            <form onSubmit={handleAddLesson}>
              <TextField
                label="Lesson Name"
                fullWidth
                margin="normal"
                value={newLessonName}
                onChange={(e) => setNewLessonName(e.target.value)}
              />
              <TextField
                label="Lesson Complexity"
                fullWidth
                margin="normal"
                value={newComplexity}
                onChange={(e) => setNewComplexity(e.target.value)}
              />
              <TextField
                label="Lesson Category"
                fullWidth
                margin="normal"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />

<FormControl fullWidth margin="normal">
            <InputLabel id="therapy-type-label">Therapy Type</InputLabel>
            <Select
              labelId="therapy-type-label"
              id="therapy-type"
              value={newTherapyType}
              label="Therapy Type"
              onChange={(e) => setNewTherapyType(e.target.value)}
            >
              <MenuItem value="SLP">SLP</MenuItem>
              <MenuItem value="OT">OT</MenuItem>
            </Select>
          </FormControl>
              <TextField
                label="Lesson Description"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  type="button"
                  onClick={handleModalClose}
                  sx={{ backgroundColor: "#2D848B",
                    borderRadius: "18px",
                    marginRight: "70px",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                    width: "30%", // Changed to 100%
                    "&:hover": {
                      backgroundColor: "#94C5B5",
                    }, }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#2D848B",
                    borderRadius: "18px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    width: "50%", // Changed to 100%
                    "&:hover": {
                      backgroundColor: "#94C5B5",
                    },
                  }}
                >
                  Add Lesson
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}