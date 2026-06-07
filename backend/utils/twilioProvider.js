const twilio = require('twilio');

const getClient = () => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || TWILIO_ACCOUNT_SID === 'your_twilio_account_sid') {
    return null;
  }
  return twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
};

const sendSMS = async (toPhone, body) => {
  const { TWILIO_PHONE_NUMBER, ADMIN_PHONE } = process.env;
  const client = getClient();
  const targetPhone = toPhone || ADMIN_PHONE;

  if (!client) {
    console.log('--- MOCK SMS ---');
    console.log(`To: ${targetPhone}`);
    console.log(`Body: ${body}`);
    console.log('----------------');
    return;
  }

  try {
    await client.messages.create({
      body: body,
      from: TWILIO_PHONE_NUMBER,
      to: targetPhone
    });
    console.log(`SMS sent successfully to ${targetPhone}`);
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }
};

module.exports = { sendSMS };
