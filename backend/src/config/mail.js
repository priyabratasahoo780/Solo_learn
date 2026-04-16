const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Non-fatal connection check (does not block startup)
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify().catch(error => {
    console.warn('\n---------------------------------------------------------');
    console.warn('⚠️  EMAIL SERVICE NOTICE: Authentication Pending');
    console.warn('The EMAIL_PASS in your .env is being rejected by Google.');
    console.warn('Your server is ACTIVE, but Emails/Certificates will fail.');
    console.warn('Action: Please generate a NEW App Password from Google.');
    console.warn('---------------------------------------------------------\n');
  });
} else {
  console.warn('⚠️ SMTP Warning: EMAIL_USER or EMAIL_PASS not set. Email features disabled.');
}

module.exports = transporter;
