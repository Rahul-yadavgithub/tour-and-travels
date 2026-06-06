const twilio = require('twilio');

const getClient = () => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || TWILIO_ACCOUNT_SID === 'your_twilio_account_sid') {
    return null;
  }
  return twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
};

const sendSMS = async (body) => {
  const { TWILIO_PHONE_NUMBER, ADMIN_PHONE } = process.env;
  const client = getClient();

  if (!client) {
    console.log('--- MOCK SMS ---');
    console.log(`To: ${ADMIN_PHONE}`);
    console.log(`Body: ${body}`);
    console.log('----------------');
    return;
  }

  try {
    await client.messages.create({
      body: body,
      from: TWILIO_PHONE_NUMBER,
      to: ADMIN_PHONE
    });
    console.log(`SMS sent successfully to ${ADMIN_PHONE}`);
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }
};

const sendWhatsApp = async (body) => {
  const { TWILIO_WHATSAPP_NUMBER, ADMIN_WHATSAPP } = process.env;
  const client = getClient();

  if (!client) {
    console.log('--- MOCK WHATSAPP ---');
    console.log(`To: whatsapp:${ADMIN_WHATSAPP}`);
    console.log(`Body: ${body}`);
    console.log('---------------------');
    return;
  }

  try {
    await client.messages.create({
      body: body,
      from: TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${ADMIN_WHATSAPP}`
    });
    console.log(`WhatsApp sent successfully to ${ADMIN_WHATSAPP}`);
  } catch (error) {
    console.error('Failed to send WhatsApp:', error);
  }
};

module.exports = { sendSMS, sendWhatsApp };
