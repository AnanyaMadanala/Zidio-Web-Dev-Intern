import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [file, setFile] = useState(null);
  const [tab, setTab] = useState('attendance'); // Default to 'attendance'

  const handleLogin = (username, password) => {
    // Handle admin login (mock authentication for simplicity)
    if (username === 'admin' && password === 'password') {
      setLoggedIn(true);
    } else {
      alert('Incorrect credentials');
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`/api/upload/${tab}`, formData); // Send file to backend API for processing
      alert('File uploaded successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  const renderLoginForm = () => (
    <div>
      <h2>Admin Login</h2>
      <input type="text" placeholder="Username" id="username" />
      <input type="password" placeholder="Password" id="password" />
      <button onClick={() => handleLogin(document.getElementById('username').value, document.getElementById('password').value)}>Login</button>
    </div>
  );

  const renderAdminPanel = () => (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <button onClick={() => setTab('attendance')}>Attendance Marks</button>
        <button onClick={() => setTab('projectReview')}>Project Review Marks</button>
        <button onClick={() => setTab('assessment')}>Assessment Marks</button>
        <button onClick={() => setTab('projectSubmission')}>Project Submission Marks</button>
        <button onClick={() => setTab('linkedInPost')}>LinkedIn Post Marks</button>
      </div>
      <div>
        <h3>Upload {tab.replace(/([A-Z])/g, ' $1')} Data</h3>
        <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleFileUpload}>Upload Excel</button>
      </div>
    </div>
  );

  return loggedIn ? renderAdminPanel() : renderLoginForm();
};

export default AdminPanel;
