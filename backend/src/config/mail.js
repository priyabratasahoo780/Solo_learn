const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: parseInt(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Non-fatal connection check (does not block startup)
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify(function (error) {
    if (error) {
      console.warn('⚠️ SMTP Warning: Email service unavailable -', error.message);
    } else {
      console.log('✅ SMTP Server connected and ready');
    }
  });
} else {
  console.warn('⚠️ SMTP Warning: EMAIL_USER or EMAIL_PASS not set. Email features will be disabled.');
}

module.exports = transporter;
