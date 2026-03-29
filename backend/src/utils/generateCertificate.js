const PDFDocument = require('pdfkit');

const generateCertificate = (user, title = 'Quiz Certification', certificateId) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 0
    });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Background Color (Academic Cream)
    doc.rect(0, 0, pageWidth, pageHeight).fill('#FCFBF7');

    // Outer Gold Border (Thick)
    doc.lineWidth(15);
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke('#C5A059');

    // Inner Decorative Border (Thin)
    doc.lineWidth(1);
    doc.rect(50, 50, pageWidth - 100, pageHeight - 100).stroke('#1F2937');

    // Header Badge / Logo Placeholder
    doc.lineWidth(2);
    doc.circle(pageWidth / 2, 90, 40).stroke('#C5A059');
    doc.font('Times-Bold').fontSize(14).fill('#C5A059').text('S', pageWidth / 2 - 5, 82);
    
    // Title
    doc.moveDown(5);
    doc.font('Times-Bold').fontSize(38).fill('#002D72').text('Diploma of Excellence', 0, 140, { align: 'center' });
    doc.fontSize(10).fill('#C5A059').text('VERIFIED PROFESSIONAL CREDENTIAL', { align: 'center', characterSpacing: 4 });
    
    // Certification Statement
    doc.moveDown(2);
    doc.font('Times-Italic').fontSize(16).fill('#4B5563').text('This is to certify that', { align: 'center' });

    // Student Name
    doc.moveDown(1);
    doc.font('Times-Bold').fontSize(42).fill('#002D72').text(user.name || user.email, { align: 'center' });
    
    // Accomplishment
    doc.moveDown(1);
    doc.font('Times-Italic').fontSize(16).fill('#4B5563').text('has demonstrated superior competence and successfully mastered', { align: 'center' });
    
    // Course Title
    doc.moveDown(1);
    doc.font('Times-Bold').fontSize(28).fill('#C5A059').text(title || 'Core Intelligence Module', { align: 'center' });

    // Details Grid
    const bottomY = pageHeight - 160;
    
    // Left: Formal Date
    doc.font('Times-Bold').fontSize(14).fill('#1F2937').text(new Date().toLocaleDateString(), 100, bottomY);
    doc.lineWidth(1).moveTo(80, bottomY + 18).lineTo(220, bottomY + 18).stroke('#D1D5DB');
    doc.font('Times-Roman').fontSize(10).fill('#9CA3AF').text('DATE OF ATTAINMENT', 100, bottomY + 25);

    // Center: Institutional Seal
    doc.circle(pageWidth / 2, bottomY + 10, 30).fill('#C5A059');
    doc.font('Times-Bold').fontSize(20).fill('#FFFFFF').text('✓', pageWidth / 2 - 8, bottomY - 3);

    // Right: Provost Signature
    doc.font('Times-Italic').fontSize(26).fill('#002D72').text('Sahoo Priyabrata', pageWidth - 290, bottomY - 10);
    doc.lineWidth(1).moveTo(pageWidth - 300, bottomY + 18).lineTo(pageWidth - 60, bottomY + 18).stroke('#D1D5DB');
    doc.font('Times-Roman').fontSize(10).fill('#9CA3AF').text('ACADEMY PROVOST', pageWidth - 240, bottomY + 25);

    // Footer: Authenticity ID
    doc.font('Courier').fontSize(8).fill('#D1D5DB').text(`Institutional ID: ${certificateId || 'SOLO-ACAD-VERIFIED'}`, 0, pageHeight - 40, { align: 'center' });

    doc.end();
  });
};

module.exports = generateCertificate;
