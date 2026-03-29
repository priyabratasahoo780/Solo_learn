import emailjs from '@emailjs/browser';

const SERVICE_ID = 'default_service'; // User should verify this in dashboard
const PUBLIC_KEY = '-TH9C7WmG2BeJ5O4l';

const templates = {
  OTP: 'template_otp',
  CERTIFICATE: 'template_certificate',
  PASSWORD_RESET: 'template_reset',
  QUIZ_REPORT: 'template_quiz'
};

/**
 * Universal EmailJS dispatcher
 * @param {string} templateKey - Keys from the templates object above
 * @param {object} params - Dynamic variables (to_name, to_email, etc.)
 */
export const sendEmailJS = async (templateKey, params) => {
  const templateId = templates[templateKey];
  if (!templateId) {
    console.error(`Invalid template key: ${templateKey}`);
    return { success: false, error: 'Invalid template' };
  }

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      templateId,
      {
        ...params,
        site_name: 'SoloLearn'
      },
      PUBLIC_KEY
    );
    console.log(`✅ Email [${templateKey}] sent successfully:`, result.text);
    return { success: true };
  } catch (error) {
    console.error(`❌ Email [${templateKey}] failed to send:`, {
      error: error,
      status: error?.status,
      text: error?.text,
      message: error?.message,
      hint: 'Check your EmailJS Public Key, Service ID, and Template ID in the dashboard.'
    });
    return { success: false, error: error.text || error.message };
  }
};

export default {
  sendOTP: (name, email, otp) => sendEmailJS('OTP', { to_name: name, to_email: email, otp }),
  sendCertificate: (name, email, certTitle, certCode) => 
    sendEmailJS('CERTIFICATE', { to_name: name, to_email: email, cert_title: certTitle, cert_code: certCode }),
  sendPasswordReset: (name, email, resetUrl) => 
    sendEmailJS('PASSWORD_RESET', { to_name: name, to_email: email, reset_url: resetUrl }),
  sendQuizReport: (name, email, scorecard) => 
    sendEmailJS('QUIZ_REPORT', { 
      to_name: name, 
      to_email: email, 
      ...scorecard 
    })
};
