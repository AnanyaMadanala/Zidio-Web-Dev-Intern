const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');
const Student = require('./models/Student'); // Model for Student data

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(fileUpload());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/resultManagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API Endpoint for Admin Login (mock authentication)
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// API Endpoint to handle file uploads based on tab (attendance, projectReview, etc.)
app.post('/api/upload/:tab', async (req, res) => {
  const { tab } = req.params;
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.files.file;
  const workbook = xlsx.read(file.data, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Map and validate Excel data based on tab
  const students = sheetData.map((row) => ({
    studentId: row['Student ID'],
    [tab]: row['Marks'], // Dynamic key for marks category
  }));

  // Save to MongoDB (upsert for existing students)
  for (const student of students) {
    await Student.updateOne({ studentId: student.studentId }, student, { upsert: true });
  }

  res.json({ message: 'File uploaded successfully.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
