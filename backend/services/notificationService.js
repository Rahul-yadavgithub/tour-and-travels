const { sendEmail } = require('../utils/emailProvider');
const { sendSMS } = require('../utils/twilioProvider');

const notifyCustomerNewEnquiry = async (enquiry) => {
  if (!enquiry.mobile) return;
  
  let phone = enquiry.mobile.toString().trim();
  // Assume Indian number if no country code provided and it's 10 digits
  if (phone.length === 10 && !phone.startsWith('+')) {
    phone = `+91${phone}`;
  } else if (!phone.startsWith('+')) {
    phone = `+${phone}`;
  }

  const messageBody = `Dear ${enquiry.fullName},\n\nThank you for your enquiry with SN Tour And Travels! We have received your details and our team will contact you with a free customized itinerary within 2 hours.\n\nWarm Regards,\nSN Tour And Travels`;

  console.log(`[Notification Service] Attempting to send Customer SMS to: ${phone}`);
  Promise.all([
    sendSMS(phone, messageBody)
  ]).catch(err => console.error("Error sending customer notification:", err));
};

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

  // Fire and forget notifications
  console.log(`[Notification Service] Attempting to send Admin Email and Admin SMS for new enquiry...`);
  Promise.all([
    sendEmail(subject, messageBody),
    sendSMS(null, messageBody)
  ]).catch(err => console.error("Error in admin notification service:", err));

  // Also notify the customer
  notifyCustomerNewEnquiry(enquiry);
};

module.exports = {
  notifyAdminNewEnquiry,
  notifyCustomerNewEnquiry
};
