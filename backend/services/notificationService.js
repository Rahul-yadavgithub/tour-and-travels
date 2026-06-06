const { sendEmail } = require('../utils/emailProvider');
const { sendSMS, sendWhatsApp } = require('../utils/twilioProvider');

const notifyAdminNewEnquiry = async (enquiry) => {
  const subject = `New Tour Enquiry from ${enquiry.fullName}`;
  const messageBody = `
New Enquiry Details:
--------------------
Name: ${enquiry.fullName}
Mobile: ${enquiry.mobile}
Email: ${enquiry.email || 'N/A'}
City: ${enquiry.city || 'N/A'}
Travel Date: ${enquiry.travelDate || 'N/A'}
Guests: ${enquiry.adults} Adults, ${enquiry.children} Children
Budget: ${enquiry.budget || 'N/A'}
--------------------
Please contact them back within 2 hours!
  `.trim();

  // Fire and forget notifications so we don't block the API response
  Promise.all([
    sendEmail(subject, messageBody),
    sendSMS(`NEW ENQUIRY: ${enquiry.fullName} (${enquiry.mobile}) for ${enquiry.adults} guests.`),
    sendWhatsApp(messageBody)
  ]).catch(err => console.error("Error in notification service:", err));
};

module.exports = {
  notifyAdminNewEnquiry
};
