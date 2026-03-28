const User = require('../models/User.model');
const Certificate = require('../models/Certificate.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { PDFDocument, rgb } = require('pdfkit'); // Using existing pdfkit dependency

// @desc    Generate a professional skill-based resume
// @route   GET /api/resume/generate
// @access  Private
exports.generatePortfolioResume = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const certs = await Certificate.find({ user: user._id });

  // 1. Prepare PDF (Digital Portfolio)
  const PDFKit = require('pdfkit');
  const doc = new PDFKit({
    size: 'A4',
    margin: 50
  });

  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    let pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename=SoloLearn_Resume_${user.name}.pdf`
    });
    
    // For this prototype, we return the base64 or a success link
    // Usually, we stream directly, but we'll simulate a 200 JSON for the frontend to handle
    res.end(JSON.stringify({
      success: true,
      data: {
        name: user.name,
        level: user.level,
        totalXp: user.xp,
        skillRadar: Object.fromEntries(user.skillPoints),
        certificates: certs.length,
        resumeGeneratedAt: new Date(),
        // digitalPayload: pdfData.toString('base64')
      }
    }));
  });

  // 2. Build Content
  doc.fontSize(24).text('PROFESSIONAL SKILL PORTFOLIO', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(user.name, { align: 'left' });
  doc.fontSize(12).text(`Level ${user.level} Fullstack Developer | SoloLearn Certified`, { align: 'left' });
  doc.moveDown();

  doc.rect(50, doc.y, 500, 2).fill('#4F46E5');
  doc.moveDown();

  doc.fontSize(16).text('CORE COMPETENCIES', { underline: true });
  doc.moveDown(0.5);
  
  user.skillPoints.forEach((points, category) => {
    if (points > 0) {
      doc.fontSize(12).text(`${category}: ${points} XP (${Math.floor(points/1000)} Star Expert)`);
    }
  });

  doc.moveDown();
  doc.fontSize(16).text('VERIFIED CERTIFICATIONS', { underline: true });
  doc.moveDown(0.5);
  
  if (certs.length === 0) {
    doc.fontSize(10).text('No certificates earned yet. Keep learning!');
  } else {
    certs.forEach(cert => {
      doc.fontSize(12).text(`- ${cert.quizTitle} (${cert.category}) - Issued: ${cert.issuedAt.toLocaleDateString()}`);
    });
  }

  doc.moveDown(2);
  doc.fontSize(10).fillColor('gray').text('This portfolio is verified by SoloLearn Advanced Learning Engine.', { align: 'center' });

  doc.end();
});
