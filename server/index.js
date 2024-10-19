const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Therapist = require('./models/therapist'); 
const Appointment = require('./models/appointment');
const Schedule = require('./models/schedule');
const Patient = require('./models/patient');
const Progress = require('./models/progress'); 
const Lesson = require('./models/lesson');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const multer = require('multer');
const upload = multer();const nodemailer = require('nodemailer'); 
const crypto = require('crypto'); 
const app = express();

const PORT = process.env.PORT || 3001;
const dotenv = require('dotenv');
dotenv.config()

const corsOptions = {
  origin: ["https://intelliwebsite.vercel.app"],
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials: true
};

app.use(cors(corsOptions));

// Connect to MongoDB 
mongoose.connect(process.env.MONGODB_CONNECTION)
  .then(() => console.log('Connected to MongoDB (Intelli-Website database)'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Backend is working!'); 
});

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
      user: 'projectintellispeechcapstone@gmail.com',
      pass: 'kzmn ensh ulbp xrun'
  }
})

const authenticateUser = async (req, res, next) => {
  try {
    console.log("Authorization header:", req.headers.authorization);

    // Check if the Authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // Correctly split the Authorization header to extract the token
    const token = req.headers.authorization.split(" ")[1];
    console.log("Extracted token:", token);

    // Check if a token was provided
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const decodedToken = jwt.verify(
      token,
      "zgbxYzATJkYibsU8lnfY0Uc65ibNzyJE" // Replace with your actual secret key or use an environment variable
    );
    console.log("Decoded token:", decodedToken);

    const user = await User.findById(decodedToken.userId);
    console.log("User:", user);

    if (!user) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Admin authorization middleware
const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
      next();
  } else {
      res.status(403).json({ error: "Forbidden" });
  }
};

app.get('/verify/:token', async (req, res) => {
  const token = req.params.token;

  try {
      const user = await User.findOne({ verificationToken: token });

      if (!user) {
          return res.status(404).send('Invalid token.');
      }

      user.verified = true;
      await user.save();

      res.send('Email verified successfully!'); // Redirect to a success page in your frontend
      res.redirect('https://intelliwebsite.vercel.app/login'); 
  } catch (error) {
      console.error('Error during verification:', error);
      res.status(500).json({ message: 'Verification failed.' });
  }
});

// User routes (modified for guardian-only signup)
app.post('/api/users', async (req, res) => {
  try {
      const { name, username, email_address, password } = req.body;

      // Check if username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email_address }] });
      if (existingUser) {
          return res.status(400).json({ error: 'Username or email already exists' });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user with verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');
      const newUser = new User({
          name,
          username,
          email_address,
          password: hashedPassword,
          role: 'guardian',
          verificationToken: verificationToken, 
          verified: false 
      });

      const savedUser = await newUser.save();

      // Send verification email
      const verificationLink = `https://intelliwebsite.vercel.app/verify/${verificationToken}`;

      const mailOptions = {
          from: 'projectintellispeechcapstone@gmail.com', 
          to: savedUser.email_address,
          subject: 'Email Verification',
          html: `<p>Click this link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ message: 'User created, verification email sent.' });
  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New route for staff to create accounts (with role selection)
app.post('/api/staff', authenticateUser, isAdmin, async (req, res) => { 
  try {
    // Include 'name' in the destructuring assignment
    const { name, username, email_address, password, role } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email_address }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name, // Include 'name' in the new user object
      username,
      email_address,
      password: hashedPassword,
      role: role || 'staff', 
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
    console.log("Login attempt with username:", username);

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log("User found:", user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log("Password valid for user:", username);

  //  if (!user.verified) {
  //    console.log("Email not verified for user:", username);
   // }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY || 'zgbxYzATJkYibsU8lnfY0Uc65ibNzyJE');
    console.log("JWT generated for user:", username);

    res.json({ 
      message: 'Login successful!', 
      token: token,  
      user: { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      }
    }); 
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

// Delete Schedule Route
app.delete('/api/schedules/:scheduleId', async (req, res) => {
  try {
    const scheduleId = req.params.scheduleId;

    // Find and delete the schedule
    const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId);

    if (!deletedSchedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Optionally, you might want to remove the schedule ID from the therapist's schedule array

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Internal Server Error'   
 });
  }
});

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

// PUT route to confirm an appointment
app.put('/api/appointments/:appointmentId/confirm', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    // Find the appointment and update its status to 'confirmed'
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { appointment_status: 'Confirmed' }, // Update the correct field: appointment_status
      { new: true } 
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error confirming appointment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE route to delete an appointment
app.delete('/api/appointments/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    // Find and delete the appointment
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ error: 'Appointment not found'   
 });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({   
 error: 'Internal Server Error'   
 });
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

app.delete('/api/therapists/:therapistId', async (req, res) => {
  try {
    const therapistId = req.params.therapistId;

    // 1. Delete the therapist's associated schedules
    await Schedule.deleteMany({ therapist_id: therapistId });

    // 2. Delete the therapist
    const deletedTherapist = await Therapist.findByIdAndDelete(therapistId);

    if (!deletedTherapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    res.json({ message: 'Therapist and associated schedules deleted successfully' });
  } catch (error) {
    console.error('Error deleting therapist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

app.post('/api/lessons', async (req, res) => {
  try {
    console.log('Received lesson data:', req.body);  // Log the received data
    const newLesson = new Lesson(req.body);
    const savedLesson = await newLesson.save();
    res.status(201).json(savedLesson);
  } catch (error) {
    console.error('Error saving lesson:', error);  // Log the complete error object
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ errors: validationErrors }); // Send validation errors
    } 
    res.status(500).json({ error: 'Failed to add lesson' });
  }
});
app.get('/api/lessons', async (req, res) => {
  try {
    console.log('Fetching lessons...'); // Log when the route is accessed
    const lessons = await Lesson.find(); 
    res.json(lessons); 
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

app.delete('/api/lessons/:lessonId', async (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    const deletedLesson = await Lesson.findByIdAndDelete(lessonId);

    if (!deletedLesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Fetch and return the updated list of lessons
    const updatedLessons = await Lesson.find();
    res.json(updatedLessons);
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

app.post('/api/patients/:patientId/assign-lesson', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { 
      lessonId, 
      lesson_name, 
      lesson_complexity, 
      lesson_category, 
      lesson_desc 
    } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $addToSet: {
          assignedLessons: {
            lessonId: lessonId,
            lesson_name: lesson_name,
            lesson_complexity: lesson_complexity,
            lesson_category: lesson_category,
            lesson_desc: lesson_desc,
          },
        },
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(updatedPatient);
  } catch (error) {
    console.error('Error assigning lesson:', error);
    res.status(500).json({ error: 'Failed to assign lesson' });
  }
});

app.delete('/api/patients/:patientId/assigned-lessons/:lessonId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const lessonId = req.params.lessonId;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $pull: { assignedLessons: { lessonId: lessonId } } }, 
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(updatedPatient);
  } catch (error) {
    console.error('Error deleting assigned lesson:', error);
    res.status(500).json({ error: 'Failed to delete assigned lesson' });
  }
});

app.get('/api/patients', async (req, res) => { 
  try {
    const patients = await Patient.find(); // Fetch all patients from the database
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

app.get('/api/patients/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

app.post('/api/patients/:patientId/assign-lesson', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { 
      lessonId, 
      lesson_name,  
      lesson_complexity, 
      lesson_category, 
      lesson_desc 
    } = req.body;


    // Find the patient and update their assigned lessons (assuming you have an "assignedLessons" array field)
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $addToSet: {
          assignedLessons: {
            lessonId: lessonId,
            lesson_name: lesson_name, // Use underscore case
            lesson_complexity: lesson_complexity,
            lesson_category: lesson_category,
            lesson_desc: lesson_desc,
          },
        },
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(updatedPatient);
  } catch (error) {
    console.error('Error assigning lesson:', error);
    res.status(500).json({ error: 'Failed to assign lesson' });
  }
});

app.post('/api/patients/:patientId/progress', upload.single('report_file'), async (req, res) => {
  try {
      const patientId = req.params.patientId;
      const progressData = req.body;

      // Log the received data for debugging
      console.log('Received progress data:', progressData);

      let reportFile = null;
      if (req.file) {
          reportFile = {
              filename: req.file.originalname,
              contentType: req.file.mimetype,
              data: req.file.buffer,
          };
      }

      // Create a new Progress object
      const newProgress = new Progress({
          patient_id: patientId,
          self_aware: progressData.self_aware === 'true', // Ensure boolean conversion
          lesson_engagement: progressData.lesson_engagement,
          improvement_state: progressData.improvement_state,
          error_frequency: progressData.error_frequency,
          progress_quality: progressData.progress_quality,
          remarks: progressData.remarks,
          progress_score: parseInt(progressData.progress_score, 10), // Convert to number
          report_file: reportFile,
      });

      const savedProgress = await newProgress.save();
      res.status(201).json(savedProgress);
  } catch (error) {
      console.error('Error updating patient progress:', error);
      res.status(500).json({ error: 'Failed to update patient progress' });
  }
});


app.get('/api/patients/:patientId/progress', async (req, res) => {
  try {
    const patientId = req.params.patientId;

    // Fetch the progress reports for the given patient
    const progressReports = await Progress.find({ patient_id: patientId });

    res.json(progressReports);
  } catch (error) {
    console.error('Error fetching progress reports:', error);
    res.status(500).json({ error: 'Failed to fetch progress reports' });
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