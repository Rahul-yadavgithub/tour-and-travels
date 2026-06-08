const AIContentService = require('../services/aiContentService');

/**
 * Generate premium AI content for a destination
 * POST /api/ai/generate
 */
const generateContent = async (req, res) => {
  try {
    const { destinationName, city, state, country } = req.body;

    if (!destinationName) {
      return res.status(400).json({ error: 'destinationName is required' });
    }

    // 1. Fetch real-world data from OpenStreetMap (Nominatim API)
    let osmData = null;
    try {
      osmData = await AIContentService.getOSMPlaceData(destinationName);
    } catch (e) {
      console.warn('Failed to fetch OSM Data', e);
    }

    // 2. Fetch images from Unsplash (optional enhancement)
    let unsplashImages = [];
    if (process.env.UNSPLASH_ACCESS_KEY) {
      unsplashImages = await AIContentService.getUnsplashImages(destinationName);
    }

    // 3. Generate structured content with OpenRouter (DeepSeek)
    const generatedData = await AIContentService.generateOpenRouterContent(
      destinationName,
      city,
      state,
      country,
      osmData
    );

    // 4. Attach unsplash images to the response as gallery suggestions
    if (unsplashImages.length > 0) {
      generatedData.suggestedImages = unsplashImages;
    }

    // 5. Send back the structured JSON
    return res.status(200).json({
      success: true,
      data: generatedData
    });

  } catch (error) {
    console.error('AI Generation Controller Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to generate content', 
      details: error.message 
    });
  }
};

const generateCarDesc = async (req, res) => {
  try {
    const { name, seatCapacity, acAvailable } = req.body;
    if (!name) return res.status(400).json({ error: 'Car name is required' });
    
    const description = await AIContentService.generateCarDescription(name, seatCapacity, acAvailable);
    return res.status(200).json({ success: true, description });
  } catch (error) {
    console.error('Car desc AI Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate car description' });
  }
};

const generateHotelDesc = async (req, res) => {
  try {
    const { name, roomType, location } = req.body;
    if (!name) return res.status(400).json({ error: 'Hotel name is required' });
    
    const description = await AIContentService.generateHotelDescription(name, roomType, location);
    return res.status(200).json({ success: true, description });
  } catch (error) {
    console.error('Hotel desc AI Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate hotel description' });
  }
};

module.exports = {
  generateContent,
  generateCarDesc,
  generateHotelDesc
};
