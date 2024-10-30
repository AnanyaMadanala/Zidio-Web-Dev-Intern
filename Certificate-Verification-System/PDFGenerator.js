// pdfGenerator.js
const PDFDocument = require('pdfkit');

async function generateCertificatePDF(certificate) {
  const doc = new PDFDocument();
  let buffers = [];
  
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(20).text('Certificate of Completion', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`This is to certify that ${certificate.studentName}`);
  doc.text(`has completed an internship in ${certificate.domain}`);
  doc.text(`from ${new Date(certificate.startDate).toLocaleDateString()} to ${new Date(certificate.endDate).toLocaleDateString()}`);
  
  doc.end();
  
  return Buffer.concat(buffers);
}

module.exports = { generateCertificatePDF };
