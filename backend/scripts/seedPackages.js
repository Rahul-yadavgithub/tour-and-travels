require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('../models/Package');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tour';

const packagesData = [
  {
    legacyId: 1,
    duration: 'Hassle-free darshan',
    title: 'Kashi Vishwanath Darshan',
    tag: 'VIP Support',
    currentPrice: 4999,
    features: ['Kashi Vishwanath VIP Darshan', 'Durgakund & Sankat Mochan', 'BHU Vishwanath Temple', 'Ram Nagar & Swarved Mandir'],
    imageUrl: 'https://res.cloudinary.com/dz8whxcuk/image/upload/v1780826105/varanasi-munshi-ghat-orange-flags-pilgrims-card_gxnj1d.webp',
    overview: 'The Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India. The temple stands on the western bank of the holy river Ganga, and is one of the twelve Jyotirlingas, the holiest of Shiva temples.',
    officialInfo: 'The current structure was built on an adjacent site by the Maratha ruler, Ahilya Bai Holkar of Indore in 1780.',
    itinerary: [
      { title: 'Arrival & Setup', desc: 'Meet with Varanasi SN Tour & Travels representative at designated point. Briefing about temple protocols and dress code.' },
      { title: 'VIP Darshan', desc: 'Skip the regular lines with our hassle-free darshan arrangement. Guided entry to the sanctum sanctorum of Kashi Vishwanath.' },
      { title: 'City Temples Tour', desc: 'Guided visit to Durgakund, Sankat Mochan Hanuman Temple, Ram Nagar, BHU Vishwanath Temple, and the spectacular Swarved Mandir.' },
      { title: 'Rituals & Departure', desc: 'Perform Jalabhishek and other sacred rituals under expert guidance. Safe drop-off back to your hotel.' }
    ]
  },
  {
    legacyId: 2,
    duration: 'Divine Experience',
    title: 'Ganga Aarti Experience',
    tag: 'Spiritual',
    currentPrice: 1999,
    features: ['Divine Ganga Aarti at Dashashwamedh Ghat', 'Local Sightseeing', 'Polite & Friendly Behaviour', '100% Customer Satisfaction'],
    imageUrl: 'https://res.cloudinary.com/dz8whxcuk/image/upload/v1780826240/ganga-aarti-varanasi-priest-night_w3hhqq.webp',
    overview: 'Ganga Aarti is a magnificent, deeply spiritual ritual performed daily on the banks of the Ganges. The most prominent Aarti takes place at Dashashwamedh Ghat in Varanasi.',
    officialInfo: 'The Aarti is conducted daily at dusk (around 6:45 PM in summer and 6:00 PM in winter). It is organized by the Ganga Seva Nidhi trust.',
    itinerary: [
      { title: 'Ghat Arrival', desc: 'Arrive at Dashashwamedh Ghat before sunset. Varanasi SN Tour & Travels will secure premium viewing spots or a private boat.' },
      { title: 'The Ceremony', desc: 'Witness the 45-minute divine spectacle as priests offer fire to the River Goddess.' },
      { title: 'Deep Daan', desc: 'Float your own diya (lamp) on the river for blessings, followed by local sightseeing of the illuminated ghats.' }
    ]
  },
  {
    legacyId: 3,
    duration: 'Complete Rituals',
    title: 'Gaya Pind Daan Service',
    tag: 'Sacred Rituals',
    currentPrice: 7999,
    features: ['Pind Daan service with complete rituals', 'Experienced priests', 'Hotel Booking Assistance', 'Reasonable Price'],
    imageUrl: 'https://varanasiayodhya.com/images/Chitrakoot-sati-ansuya-temple.webp',
    overview: 'Gaya is a city of profound historical and mythological significance in Bihar, India, renowned globally as a crucial site for Pind Daan (offerings made to deceased ancestors).',
    officialInfo: 'The primary rituals take place at the Phalgu River, Vishnupad Temple, and Akshayavat.',
    itinerary: [
      { title: 'Preparation', desc: 'Meet the experienced priests assigned by Varanasi SN Tour & Travels. Arrangement of all necessary Samagri (ritual items).' },
      { title: 'Phalgu River Rituals', desc: 'Initial purifying bath and starting the Shraddha rituals on the banks of the Phalgu River.' },
      { title: 'Vishnupad Temple', desc: 'Perform the main Pind Daan inside the temple premises under the guidance of Acharyas, ensuring complete adherence to Vedic procedures.' }
    ]
  },
  {
    legacyId: 4,
    duration: 'Ayodhya Darshan',
    title: 'Ayodhya Ram Mandir Tour',
    tag: 'Most Popular',
    currentPrice: 5999,
    oldPrice: 6999,
    features: ['Darshan of Shri Ram Janmabhoomi', 'Major temples of Ayodhya', 'Family & Group Tours', 'Safe & Trusted Guide'],
    imageUrl: 'https://res.cloudinary.com/dz8whxcuk/image/upload/v1780826320/ayodhya-ram-mandir_d1s5dq.webp',
    overview: 'The Ram Mandir is a Hindu temple in Ayodhya, Uttar Pradesh, India, located at the sacred Ram Janmabhoomi, the widely believed birthplace of Rama.',
    officialInfo: 'The temple complex is managed by the Shri Ram Janmabhoomi Teerth Kshetra trust. Standard Darshan timings are from 7:00 AM to 11:30 AM and 2:00 PM to 7:00 PM.',
    itinerary: [
      { title: 'Arrival in Ayodhya', desc: 'Pick up and transfer. Proceed through security checkpoints with Varanasi SN Tour & Travels assistance.' },
      { title: 'Ram Mandir Darshan', desc: 'Guided entry to the Ram Janmabhoomi complex for the darshan of Ram Lalla.' },
      { title: 'Local Temples', desc: 'Visit to Hanuman Garhi, Kanak Bhawan, and the serene Saryu River ghats.' }
    ]
  },
  {
    legacyId: 5,
    duration: 'Sacred Bath',
    title: 'Prayagraj Sangam Tour',
    tag: 'Pilgrimage',
    currentPrice: 4499,
    features: ['Triveni Sangam bath', 'Bade Hanuman Ji', 'Visit to sacred places', 'Excellent Service'],
    imageUrl: 'https://res.cloudinary.com/dz8whxcuk/image/upload/v1780825660/prayagraj-triveni-sangam-boat-seagulls-card_ht7dg9.webp',
    overview: 'Prayagraj (formerly Allahabad) is home to the Triveni Sangam, the sacred confluence of three rivers: the Ganges, the Yamuna, and the mythical Saraswati.',
    officialInfo: 'Boats are required to reach the exact point of confluence. The site is open year-round, but water levels fluctuate depending on the season.',
    itinerary: [
      { title: 'Boat to Sangam', desc: 'Board a private boat chartered by Varanasi SN Tour & Travels to navigate to the exact Triveni confluence.' },
      { title: 'Holy Snan', desc: 'Perform the sacred bath (snan) and conduct personal pujas on the floating platforms.' },
      { title: 'Sacred Tour', desc: 'Visit the unique reclining Bade Hanuman Ji temple and view the historic Allahabad Fort from the river.' }
    ]
  },
  {
    legacyId: 6,
    duration: 'Sacred Tour',
    title: 'Vindhyachal Darshan & Trikon Parikrama',
    tag: 'Shakti Peeth',
    currentPrice: 3999,
    features: ['Maa Vindhyavasini Darshan', 'Ashtabhuja Temple', 'Kali Khoh Temple', 'Sita Samahit Sthal Excursion'],
    imageUrl: 'https://res.cloudinary.com/dz8whxcuk/image/upload/v1780826392/Vindhyavasini_mata_dz7l4p.jpg',
    overview: 'Vindhyachal is a prominent Hindu pilgrimage town in the Mirzapur district of Uttar Pradesh. It is widely known for its sacred temples and the ritual of Trikon Parikrama.',
    officialInfo: 'The Trikon Parikrama consists of visiting three main temples: Maa Vindhyavasini, Ashtabhuja, and Kali Khoh.',
    itinerary: [
      { title: 'Arrival & Darshan', desc: 'Arrive in Vindhyachal. VIP darshan of Maa Vindhyavasini at the main temple on the banks of the Ganges.' },
      { title: 'Trikon Parikrama', desc: 'Proceed for the sacred Trikon Parikrama, visiting the hilltop Ashtabhuja Temple and the Kali Khoh cave temple.' },
      { title: 'Sita Samahit Sthal', desc: 'Excursion to Sitamarhi in Bhadohi to see the 108-foot Hanuman statue and the sacred site of Sita Mata.' }
    ]
  }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    await Package.deleteMany({});
    console.log('Cleared existing packages');
    
    for (let pkg of packagesData) {
      await Package.create(pkg);
    }
    
    console.log('Successfully seeded packages!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
