const axios = require('axios');

/**
 * AI Content Generation Service
 */
class AIContentService {
  /**
   * Fetch place details from OpenStreetMap Nominatim API
   * @param {string} destinationName 
   */
  static async getOSMPlaceData(destinationName) {
    try {
      // Nominatim requires a User-Agent header per their terms of use
      const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destinationName)}&format=json&limit=1`;
      const searchRes = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'TourAndTravelsAdmin/1.0 (hello@tourandtravels.com)',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      
      if (!searchRes.data || searchRes.data.length === 0) {
        return null;
      }

      const place = searchRes.data[0];
      
      return {
        name: place.name || place.display_name,
        type: place.type,
        location: {
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon)
        },
        boundingBox: place.boundingbox
      };
    } catch (error) {
      console.error('Error fetching OSM Nominatim data:', error.message);
      return null;
    }
  }

  /**
   * Fetch premium images from Unsplash API
   * @param {string} query 
   * @param {number} imageCount 
   */
  static async getUnsplashImages(query, imageCount = 5) {
    try {
      if (!process.env.UNSPLASH_ACCESS_KEY) {
        console.warn('Unsplash API key is missing. Skipping Unsplash data fetch.');
        return [];
      }

      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=${imageCount}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
      const res = await axios.get(url);
      
      if (res.data && res.data.results) {
        return res.data.results.map(img => ({
          url: img.urls.regular,
          description: img.alt_description,
          photographer: img.user.name
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching Unsplash images:', error.message);
      return [];
    }
  }

  /**
   * Generate premium content using OpenRouter
   */
  static async generateOpenRouterContent(destinationName, city, state, country, osmData) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API Key is missing in environment variables.');
    }

    const systemPrompt = `You are an elite AI Travel Content & Tourism Intelligence Engine for a premium spiritual tourism platform.

Your task is to generate HIGHLY ACCURATE, PREMIUM, SEO-OPTIMIZED, VISUALLY RICH, and USER-ENGAGING tourism content for a given temple, religious place, spiritual destination, historical attraction, or travel destination.

IMPORTANT RULES:
1. NEVER hallucinate factual information.
2. NEVER generate fake coordinates, ratings, addresses, or timings.
3. If factual information is missing, return null.
4. Generate content in PREMIUM HUMAN-LIKE WRITING STYLE.
5. The tone must feel: spiritual, luxurious, emotionally engaging, trustworthy, travel-oriented, modern tourism quality.
6. Generate content optimized for: SEO, Google indexing, tourism conversion, premium UI rendering, mobile-friendly frontend sections.
7. Output MUST be STRICTLY VALID JSON.
8. Do NOT include markdown.
9. Do NOT include explanations.
10. Do NOT include extra text outside JSON.
11. Generate structured content ready for direct MongoDB insertion.
12. Generate content suitable for a premium tour & travels website.
13. NEVER include tags, labels, or phrases that mention "AI" such as "AI Proved Route", "AI Premium Route", or "AI Verified". Do not mention "AI" anywhere in the content. INSTEAD, strictly use highly organic and relevant tags like "Spiritual", "Most Popular Hindu Mandir", "Heritage", "Sacred Pilgrimage", etc.

---------------------------------------------------
INPUT DATA
---------------------------------------------------
Temple/Destination Name: ${destinationName}
City: ${city || 'Unknown'}
State: ${state || 'Unknown'}
Country: ${country || 'India'}
OpenStreetMap Data: ${osmData ? JSON.stringify(osmData) : 'None'}

---------------------------------------------------
OUTPUT FORMAT
---------------------------------------------------
Return STRICTLY VALID JSON ONLY following the structure below. DO NOT WRAP IN MARKDOWN BACKTICKS.

{
  "name": "",
  "slug": "",
  "heroSection": { "title": "", "subtitle": "", "tagline": "", "ctaText": "", "heroDescription": "" },
  "seo": { "metaTitle": "", "metaDescription": "", "keywords": [] },
  "location": { "address": "", "city": "", "state": "", "country": "", "coordinates": { "lat": null, "lng": null } },
  "ratings": { "googleRating": null, "totalReviews": null, "reviewsSummary": "" },
  "overview": { "shortDescription": "", "detailedDescription": "", "spiritualAtmosphere": "", "culturalImportance": "", "devotionalImportance": "" },
  "history": { "origin": "", "historicalBackground": "", "architecture": "", "renovationHistory": "" },
  "visitInfo": { "openingHours": "", "bestTimeToVisit": "", "idealVisitDuration": "", "crowdLevel": "", "entryFee": "", "vipDarshanAvailable": false, "photographyAllowed": "", "dressCode": "" },
  "weatherGuide": { "summer": "", "winter": "", "monsoon": "", "recommendedSeason": "" },
  "travelGuide": { "howToReach": { "byAir": "", "byTrain": "", "byRoad": "" }, "localTransport": "", "travelTips": [], "safetyTips": [], "familyFriendlyInfo": "" },
  "festivalInfo": [ { "festivalName": "", "description": "", "bestExperience": "" } ],
  "topExperiences": [ { "title": "", "description": "" } ],
  "nearbyAttractions": [ { "name": "", "description": "", "distance": "" } ],
  "foodRecommendations": [ { "dish": "", "description": "" } ],
  "faqs": [ { "question": "", "answer": "" } ],
  "itinerary": { "oneDayPlan": "", "twoDayPlan": "", "spiritualJourneySuggestion": "" },
  "gallerySearchKeywords": [],
  "emotionalHighlights": [],
  "aiGeneratedTags": [],
  "recommendedFor": [],
  "contentQualityScore": 100,
  "lastAIUpdated": "${new Date().toISOString()}"
}`;

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          // Using the free 120B parameter model requested by the user
          model: 'openai/gpt-oss-120b:free',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Generate the premium JSON content for ${destinationName}. Return JSON ONLY. Do not use markdown.`
            }
          ]
        },
        {
          timeout: 240000,
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://tour-and-travels-fawn.vercel.app', // Used by OpenRouter
            'X-Title': 'Tour and Travels Engine', // Used by OpenRouter
            'Content-Type': 'application/json'
          }
        }
      );

      let content = response.data.choices[0].message.content.trim();
      
      // Cleanup any markdown code block artifacts just in case
      if (content.startsWith('\`\`\`json')) {
        content = content.replace(/^\`\`\`json/g, '').replace(/\`\`\`$/g, '').trim();
      } else if (content.startsWith('\`\`\`')) {
        content = content.replace(/^\`\`\`/g, '').replace(/\`\`\`$/g, '').trim();
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating OpenRouter content:', error.response?.data || error.message);
      throw new Error('Failed to generate AI content');
    }
  }
}

module.exports = AIContentService;
