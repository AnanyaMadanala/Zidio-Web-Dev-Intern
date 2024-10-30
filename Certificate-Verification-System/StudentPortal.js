import React, { useState } from 'react';
import axios from 'axios';

const StudentPortal = () => {
  const [certificateID, setCertificateID] = useState('');
  const [certificateData, setCertificateData] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/certificate/${certificateID}`);
      setCertificateData(response.data);
    } catch (error) {
      alert('Certificate not found');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/api/certificate/download/${certificateID}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${certificateID}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Error downloading certificate');
    }
  };

  return (
    <div>
      <h3>Student Portal</h3>
      <input
        type="text"
        placeholder="Enter Certificate ID"
        value={certificateID}
        onChange={(e) => setCertificateID(e.target.value)}
      />
      <button onClick={handleSearch}>Fetch Certificate</button>

      {certificateData && (
        <div>
          <h4>Certificate Details</h4>
          <p>Name: {certificateData.studentName}</p>
          <p>Domain: {certificateData.domain}</p>
          <p>Start Date: {new Date(certificateData.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(certificateData.endDate).toLocaleDateString()}</p>
          <button onClick={handleDownload}>Download Certificate</button>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
