const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const xlsx = require('xlsx');
const Student = require('./models/Student'); // Define Student model
const { generateCertificatePDF } = require('./pdfGenerator');

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/certificateVerification', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

// Endpoint to upload and process Excel file
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Validate and save data to MongoDB
  try {
    for (const record of data) {
      if (record.certificateID && record.studentName && record.domain && record.startDate && record.endDate) {
        const student = new Student({
          certificateID: record.certificateID,
          studentName: record.studentName,
          domain: record.domain,
          startDate: record.startDate,
          endDate: record.endDate,
        });
        await student.save();
      } else {
        throw new Error('Invalid data format');
      }
    }
    res.status(200).send('Data uploaded successfully');
  } catch (error) {
    res.status(400).send('Data validation failed');
  }
});

// Endpoint to fetch certificate details by ID
app.get('/api/certificate/:id', async (req, res) => {
  try {
    const certificate = await Student.findOne({ certificateID: req.params.id });
    if (!certificate) return res.status(404).send('Certificate not found');
    res.status(200).json(certificate);
  } catch (error) {
    res.status(500).send('Error retrieving certificate');
  }
});

// Endpoint to generate downloadable PDF
app.get('/api/certificate/download/:id', async (req, res) => {
  try {
    const certificate = await Student.findOne({ certificateID: req.params.id });
    if (!certificate) return res.status(404).send('Certificate not found');

    const pdfBuffer = await generateCertificatePDF(certificate);
    res.setHeader('Content-Disposition', `attachment; filename=${certificate.certificateID}.pdf`);
    res.type('application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send('Error generating PDF');
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
