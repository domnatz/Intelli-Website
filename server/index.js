const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Therapist = require('./models/therapist'); 
const Appointment = require('./models/appointment');
const Schedule = require('./models/schedule');
const Patient = require('./models/patient');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB 
mongoose.connect('mongodb+srv://janlnato:domNATZ02@intellispeech.q35kg.mongodb.net/Intelli-Website')
  .then(() => console.log('Connected to MongoDB (Intelli-Website database)'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the React frontend build folder (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// User routes
app.post('/api/users', async (req, res) => {
  try {
    const { username, email_address, password, role } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email_address }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Check if a staff account already exists 
    if (role === 'staff') {
      const existingStaff = await User.findOne({ role: 'staff' });
      if (existingStaff) {
        return res.status(400).json({ error: 'A staff account already exists' });
      }
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      ...req.body,
      password: hashedPassword 
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Basic login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In a real app, you'd generate and send an authentication token/session here
    res.json({ message: 'Login successful!', user }); 
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Therapist Schedule Route
app.get('/api/therapist-schedule', async (req, res) => {
  try {
    console.log('Received request for therapist schedule at:', req.url);

    // Fetch schedules and populate therapist details
    const scheduleData = await Schedule.find().populate('therapist_id');

    // Log the fetched data and populated therapist details for debugging
    console.log('Raw scheduleData:', scheduleData); 
    console.log('Populated therapist details:', scheduleData.map(item => item.therapist_id)); 

    // Check if any schedule data was found
    if (scheduleData.length === 0) {
      console.log('No therapist schedule data found.');
      return res.status(404).json({ error: 'No therapist schedule data found.' });
    }

    // Explicitly set the Content-Type header to ensure JSON response
    res.setHeader('Content-Type', 'application/json');

    // Send the schedule data as a JSON response 
    res.json(scheduleData);

    // Log the successful response
    console.log('Sent therapist schedule data successfully.');
  } catch (err) {
    // Handle errors and send appropriate JSON responses
    console.error('Error fetching therapist schedule:', err);

    // Set Content-Type even in case of an error
    res.setHeader('Content-Type', 'application/json');

    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).json({ error: err.message }); // Bad Request with error details
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// ... other imports

// ... other routes

// Appointment routes
// GET route to fetch all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    // Fetch all appointments from the database
    const appointments = await Appointment.find(); 

    console.log("Fetched appointments data:", appointments); 

    // No filtering - send all appointments as JSON
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error); 
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});
// ... other routes
// Therapist routes
app.get('/api/therapists', async (req, res) => {
  try {
    console.log('Fetching therapists from the database...'); 
    const therapists = await Therapist.find();
    console.log('Fetched therapists:', therapists);
    res.json(therapists);
  } catch (error) {
    console.error('Error fetching therapists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add a route to handle creating new therapists
app.post('/api/therapists', async (req, res) => {
  try {
    console.log('Received new therapist data:', req.body); 

    const newTherapist = new Therapist(req.body);
    const savedTherapist = await newTherapist.save();
    console.log('Therapist saved:', savedTherapist);

    // Refetch and update the therapists list after adding a new one
    const updatedTherapists = await Therapist.find();
    res.status(201).json(updatedTherapists);
  } catch (error) {
    console.error('Error creating therapist:', error);

    // Handle validation errors and duplicate key errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors });
    } else if (error.code === 11000) { 
      return res.status(400).json({ error: 'Therapist with this name already exists' });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
      console.log('Received appointment data:', req.body);

      // Extract patient_id and the rest of the appointment data
      const { patient_id, ...restOfAppointmentData } = req.body;

      // Check if patient_id is provided
      if (!patient_id) {
          return res.status(400).json({ error: 'Patient ID is required' });
      }

      // More explicit validation and type checking 
      if (typeof restOfAppointmentData.appointment_date !== 'string') {
          return res.status(400).json({ error: 'Invalid appointment date. Please provide a string in YYYY-MM-DD format.' });
      }

      if (typeof restOfAppointmentData.start_time !== 'string' || 
          typeof restOfAppointmentData.end_time !== 'string') {
          return res.status(400).json({ error: 'Invalid appointment time. Please provide start_time and end_time as ISO strings.' });
      }

      // Convert date and time strings to Date objects
      restOfAppointmentData.appointment_date = new Date(restOfAppointmentData.appointment_date);
      restOfAppointmentData.start_time = new Date(restOfAppointmentData.start_time);
      restOfAppointmentData.end_time = new Date(restOfAppointmentData.end_time);

      // Create a new appointment document
      const newAppointment = new Appointment({
          patient_id,
          ...restOfAppointmentData
      });

      // Save the appointment to the database
      const savedAppointment = await newAppointment.save();

      res.status(201).json(savedAppointment);
  } catch (error) {
      console.error('Error creating appointment:', error);

      // Handle validation errors from Mongoose
      if (error.name === 'ValidationError') {
          const errors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({ error: errors });
      }

      // Handle duplicate key errors (if you have unique constraints in your schema)
      if (error.code === 11000) {
          return res.status(400).json({ error: 'An appointment with this patient and time already exists' });
      }

      // Handle other Mongoose errors (e.g., CastError for invalid data types)
      if (error instanceof mongoose.Error) {
          return res.status(400).json({ error: error.message });
      }

      // Handle any other unexpected errors
      return res.status(500).json({ error: 'Internal Server Error. Please check server logs for details.' });
  }
});
// Patient routes
app.post('/api/patients', async (req, res) => {
  try {
      console.log('Received POST request to /api/patients');

      const {
          guardian_id,
          patient_name,
          date_of_birth,
          patient_sex,
          patient_age,
          physician_name,
          diagnosis,
          siblings,
          sle_concerns,
          sle_receptive_skills,
          sle_motor_skills,
          school_skills,
          physical_tasks,
          therapy_types,
      } = req.body;

      // Basic input validation - check if required fields are present
      const requiredFields = [
          'patient_name',
          'date_of_birth',
          'patient_sex',
          'patient_age',
          'physician_name'
      ];

      for (const field of requiredFields) {
          if (!req.body[field]) {
              return res.status(400).json({ error: `Missing required field: ${field}` });
          }
      }

      // Additional validation and type checking 
      if (typeof req.body.patient_age !== 'number' || isNaN(req.body.patient_age)) {
          return res.status(400).json({ error: 'Invalid patient age. Please provide a number.' });
      }

      // Conditionally check for sle_concerns only if therapy_types includes 'slp'
      if (therapy_types.includes('slp')) {
          if (typeof sle_concerns === 'undefined' || sle_concerns === null) {
              return res.status(400).json({ error: 'Missing sle_concerns object for speech therapy.' });
          }
          if (typeof sle_concerns.speech_concern !== 'boolean') {
              return res.status(400).json({ error: 'Invalid value for speech concern. Please provide true or false.' });
          }
      }

      // Provide default values for missing fields
      const patientData = {
          guardian_id,
          patient_name,
          date_of_birth,
          patient_sex,
          patient_age,
          physician_name,
          diagnosis,
          siblings,
          sle_concerns: sle_concerns || {}, 
          sle_receptive_skills: sle_receptive_skills || {}, 
          sle_motor_skills: sle_motor_skills || {}, 
          school_skills: school_skills || {}, 
          physical_tasks: physical_tasks || {}, 
          therapy_types,
      };

      let patient;
      if (req.body.patient_id) {
          // Fetch the existing patient data if patient_id is provided
          patient = await Patient.findById(req.body.patient_id);
          if (!patient) {
              return res.status(404).json({ error: 'Patient not found' });
          }

          // Merge the incoming data with the existing patient data
          for (const key in req.body) {
              if (req.body.hasOwnProperty(key)) {
                  patient[key] = req.body[key];
              }
          }
      } else {
          // Create a new patient if patient_id is not provided
          patient = new Patient(patientData);
      }

      const savedPatient = await patient.save();
      res.status(201).json(savedPatient);
  } catch (error) {
      console.error('Error creating patient:', error);

      if (error.name === 'ValidationError') {
          const errors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({ error: errors });
      } else if (error.code === 11000) { // Example: Duplicate key error
          return res.status(400).json({ error: 'A patient with this name already exists' });
      } else if (error instanceof mongoose.Error.CastError) {
          return res.status(400).json({ error: `Invalid data type for field '${error.path}'. Expected ${error.kind}, received ${typeof error.value}` });
      } else {
          return res.status(500).json({ error: 'Internal Server Error. Please check server logs for details.' });
      }
  }
});
// ... other routes and middleware

/*app.get('/api/therapists-avail', async (req, res) => {
  try {
    let { selectedSchedule, selectedDate } = req.query;

    console.log('Received selectedSchedule:', selectedSchedule);
    console.log('Received selectedDate:', selectedDate);

    if (!selectedSchedule || !selectedDate) {
      // Handle missing parameters explicitly
      return res.status(400).json({ error: 'Missing schedule or date' }); 
    }

    // Convert selectedDate to a Date object and set it to midnight UTC
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setUTCHours(0, 0, 0, 0);

    // Fetch therapists and populate their schedules
    const therapists = await Therapist.find().populate('schedule');

    console.log('Fetched therapists (before filtering):', therapists);

    // Extract start and end times from selectedSchedule
    let startTimeStr, endTimeStr;
    if (typeof selectedSchedule === 'string' && selectedSchedule.includes(' - ')) {
      [startTimeStr, endTimeStr] = selectedSchedule.split(' - ');
    } else {
      // If the format is not as expected, log an error and return an error response
      console.error('Unexpected selectedSchedule format:', selectedSchedule);
      return res.status(400).json({ error: 'Invalid time range format' }); 
    }

    // Create Date objects for the start and end of the selected time slot (in UTC)
    const startTimeUTC = new Date(Date.UTC(
      selectedDateObj.getUTCFullYear(),
      selectedDateObj.getUTCMonth(),
      selectedDateObj.getUTCDate(),
      parseInt(startTimeStr.split(':')[0], 10),
      parseInt(startTimeStr.split(':')[1], 10)
    ));
    const endTimeUTC = new Date(Date.UTC(
      selectedDateObj.getUTCFullYear(),
      selectedDateObj.getUTCMonth(),
      selectedDateObj.getUTCDate(),
      parseInt(endTimeStr.split(':')[0], 10),
      parseInt(endTimeStr.split(':')[1], 10)
    ));

    // Filter therapists
    const availableTherapists = therapists.filter(therapist => {
      if (!therapist.schedule || !Array.isArray(therapist.schedule)) {
        return false;
      }

      return therapist.schedule.some(therapistSchedule => {
        // Check for valid schedule entry and Date objects
        if (
          !therapistSchedule ||
          !therapistSchedule.start_time ||
          !therapistSchedule.end_time ||
          !(therapistSchedule.start_time instanceof Date) ||
          !(therapistSchedule.end_time instanceof Date)
        ) {
          return false;
        }

        // Check if the schedule's date and time range match
        const isDateMatch = therapistSchedule.start_time.getUTCFullYear() === selectedDateObj.getUTCFullYear() &&
          therapistSchedule.start_time.getUTCMonth() === selectedDateObj.getUTCMonth() &&
          therapistSchedule.start_time.getUTCDate() === selectedDateObj.getUTCDate();

        const isScheduleMatch = therapistSchedule.start_time.getTime() <= startTimeUTC.getTime() &&
          therapistSchedule.end_time.getTime() >= endTimeUTC.getTime() &&
          therapistSchedule.schedule === selectedSchedule; // Directly compare with selectedSchedule

        return isScheduleMatch && isDateMatch;
      });
    });

    console.log('Available therapists:', availableTherapists);

    res.json(availableTherapists);

  } catch (error) {
    console.error('Error fetching therapists:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}); */
// Route to handle creating new schedules
app.post('/api/schedules', async (req, res) => {
  try {
    console.log('Received schedule data:', req.body); 

    const newSchedule = new Schedule(req.body);
    const savedSchedule = await newSchedule.save();

    // Update the therapist's schedule array
    const updatedTherapist = await Therapist.findByIdAndUpdate(newSchedule.therapist_id, {
      $push: { schedule: savedSchedule._id }
    });

    console.log('Updated therapist:', updatedTherapist); // Log the result of the update operation

    res.status(201).json(savedSchedule); 
  }catch (error) {
    console.error('Error creating schedule:', error);

    // Handle validation errors 
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


// Catch-all route to serve the index.html for client-side routing (for production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next(); // Make sure to call next() to pass control to the next middleware/route handler
});
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (!res.headersSent) { 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Global error handler 
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});