require('dotenv').config();
const { sendSMS } = require('./utils/twilioProvider');

(async () => {
  console.log("Testing Twilio SMS...");
  await sendSMS('+918219033998', 'Test SMS from backend script');
  console.log("Done testing.");
})();
