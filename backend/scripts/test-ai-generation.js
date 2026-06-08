require('dotenv').config();
const AIContentService = require('../services/aiContentService');

async function runTest() {
  console.log('--- Starting AI Content Generation Test ---');
  
  const destinationName = "Kashi Vishwanath Temple";
  const city = "Varanasi";
  const state = "Uttar Pradesh";
  const country = "India";

  console.log(`\nTesting for: ${destinationName}, ${city}`);

  if (!process.env.OPENROUTER_API_KEY) {
    console.error('ERROR: OPENROUTER_API_KEY is not set in .env file!');
    return;
  }

  try {
    // 1. Test OpenStreetMap Nominatim API
    console.log('Fetching OpenStreetMap (Nominatim) data...');
    let osmData = await AIContentService.getOSMPlaceData(destinationName);
    console.log('OpenStreetMap Data:', osmData ? 'Success' : 'Not Found');

    // 2. Test Unsplash API (Optional)
    let unsplashImages = [];
    if (process.env.UNSPLASH_ACCESS_KEY) {
      console.log('Fetching Unsplash images...');
      unsplashImages = await AIContentService.getUnsplashImages(destinationName);
      console.log(`Unsplash Images: Found ${unsplashImages.length}`);
    }

    // 3. Test OpenRouter Generation
    console.log(`\nGenerating Content with OpenRouter (Model: deepseek/deepseek-chat-v3-0324:free)...`);
    console.log('This may take 10-30 seconds depending on the model response time...\n');
    
    const startTime = Date.now();
    const result = await AIContentService.generateOpenRouterContent(
      destinationName,
      city,
      state,
      country,
      osmData
    );
    const endTime = Date.now();

    console.log(`SUCCESS! Generated content in ${((endTime - startTime) / 1000).toFixed(2)} seconds.`);
    
    // Attach images to result to simulate controller behavior
    if (unsplashImages.length > 0) {
      result.suggestedImages = unsplashImages;
    }

    // Print a preview of the JSON
    console.log('\n--- PREVIEW OF GENERATED JSON ---');
    console.log(JSON.stringify({
      name: result.name,
      heroSection: result.heroSection,
      seo: result.seo,
      contentQualityScore: result.contentQualityScore
    }, null, 2));
    console.log('\n(Note: Full JSON is much larger and contains all requested fields)');

  } catch (error) {
    console.error('\nTEST FAILED!');
    console.error(error.message);
    if (error.response?.data) {
      console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

runTest();
