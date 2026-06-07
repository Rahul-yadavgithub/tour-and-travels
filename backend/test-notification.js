require('dotenv').config();
const { notifyAdminNewEnquiry } = require('./services/notificationService');

(async () => {
  const mockEnquiry = {
    fullName: "Integration Test",
    mobile: "8219033998",
    email: "test@example.com",
    city: "Mumbai",
    travelDate: "2026-06-10",
    adults: 2,
    children: 0,
    budget: "Standard"
  };
  
  console.log("Triggering notifyAdminNewEnquiry...");
  await notifyAdminNewEnquiry(mockEnquiry);
  // Give it a second to finish the fire-and-forget promises
  await new Promise(r => setTimeout(r, 3000));
  console.log("Done testing notification service.");
})();
