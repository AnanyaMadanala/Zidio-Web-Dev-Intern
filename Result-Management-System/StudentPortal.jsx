import React, { useState } from 'react';
import axios from 'axios';

const StudentPortal = () => {
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/student/${studentId}`);
      setStudentData(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
      alert('No student data found.');
    }
  };

  return (
    <div>
      <h3>Student Portal</h3>
      <input
        type="text"
        placeholder="Enter Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {studentData && (
        <div>
          <h4>Results for {studentData.studentId}</h4>
          <p>Attendance Marks: {studentData.attendance}</p>
          <p>Project Review Marks: {studentData.projectReview}</p>
          <p>Assessment Marks: {studentData.assessment}</p>
          <p>Project Submission Marks: {studentData.projectSubmission}</p>
          <p>LinkedIn Post Marks: {studentData.linkedInPost}</p>
          <p>Total Marks: {studentData.attendance + studentData.projectReview + studentData.assessment + studentData.projectSubmission + studentData.linkedInPost}</p>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
