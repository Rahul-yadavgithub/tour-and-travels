const nodemailer = require('nodemailer');

const sendEmail = async (subject, text) => {
  const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL } = process.env;

  // If no email configured, mock it to console
  if (!EMAIL_USER || EMAIL_USER === 'your_email@gmail.com') {
    console.log('--- MOCK EMAIL ---');
    console.log(`To: ${ADMIN_EMAIL}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log('------------------');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: ADMIN_EMAIL,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

module.exports = { sendEmail };
