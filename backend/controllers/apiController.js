const Enquiry = require('../models/Enquiry');
const { notifyAdminNewEnquiry } = require('../services/notificationService');

const packages = [
  {
    id: 1,
    duration: 'Hassle-free darshan',
    title: 'Kashi Vishwanath Darshan',
    tag: 'VIP Support',
    price: 'Enquire',
    features: ['Hassle-free darshan arrangement', 'Baba Vishwanath Ji Darshan', 'Safe & Trusted Guide', 'Experienced & Professional Guide'],
    link: '/package/1',
    imageUrl: 'https://varanasiayodhya.com/images/varanasi-munshi-ghat-orange-flags-pilgrims-card.webp',
    overview: 'The Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India. The temple stands on the western bank of the holy river Ganga, and is one of the twelve Jyotirlingas, the holiest of Shiva temples. The main deity is known by the name Shri Vishwanath and Vishweshwara literally meaning "Lord of the Universe". Varanasi was called Kashi in ancient times, and hence the temple is popularly called Kashi Vishwanath Temple.',
    officialInfo: 'The current structure was built on an adjacent site by the Maratha ruler, Ahilya Bai Holkar of Indore in 1780. Since 1983, the temple has been managed by the Government of Uttar Pradesh under the Shri Kashi Vishwanath Temple Act.',
    itinerary: [
      { title: 'Arrival & Setup', desc: 'Meet with Amit Guide representative at designated point. Briefing about temple protocols and dress code.' },
      { title: 'VIP Darshan', desc: 'Skip the regular lines with our hassle-free darshan arrangement. Guided entry to the sanctum sanctorum.' },
      { title: 'Rituals & Departure', desc: 'Perform Jalabhishek and other sacred rituals under expert guidance. Safe drop-off back to your hotel.' }
    ]
  },
  {
    id: 2,
    duration: 'Divine Experience',
    title: 'Ganga Aarti Experience',
    tag: 'Spiritual',
    price: 'Enquire',
    features: ['Divine Ganga Aarti at Dashashwamedh Ghat', 'Local Sightseeing', 'Polite & Friendly Behaviour', '100% Customer Satisfaction'],
    link: '/package/2',
    imageUrl: 'https://varanasiayodhya.com/images/ganga-aarti-varanasi-priest-night.webp',
    overview: 'Ganga Aarti is a magnificent, deeply spiritual ritual performed daily on the banks of the Ganges. The most prominent Aarti takes place at Dashashwamedh Ghat in Varanasi. It involves the chanting of hymns, the rhythmic ringing of bells, and the offering of light to the holy river via multi-tiered brass lamps (diyas). It is a highly choreographed ceremony performed by young pandits draped in traditional attire.',
    officialInfo: 'The Aarti is conducted daily at dusk (around 6:45 PM in summer and 6:00 PM in winter). It is organized by the Ganga Seva Nidhi trust. Seating is on a first-come, first-served basis unless special boat seating is arranged.',
    itinerary: [
      { title: 'Ghat Arrival', desc: 'Arrive at Dashashwamedh Ghat before sunset. Amit Guide will secure premium viewing spots or a private boat.' },
      { title: 'The Ceremony', desc: 'Witness the 45-minute divine spectacle as priests offer fire to the River Goddess.' },
      { title: 'Deep Daan', desc: 'Float your own diya (lamp) on the river for blessings, followed by local sightseeing of the illuminated ghats.' }
    ]
  },
  {
    id: 3,
    duration: 'Complete Rituals',
    title: 'Gaya Pind Daan Service',
    tag: 'Sacred Rituals',
    price: 'Enquire',
    features: ['Pind Daan service with complete rituals', 'Experienced priests', 'Hotel Booking Assistance', 'Reasonable Price'],
    link: '/package/3',
    imageUrl: 'https://varanasiayodhya.com/images/Chitrakoot-sati-ansuya-temple.webp', // Using existing image for visual placeholder
    overview: 'Gaya is a city of profound historical and mythological significance in Bihar, India, renowned globally as a crucial site for Pind Daan (offerings made to deceased ancestors). According to Hindu tradition, performing Pind Daan at the Vishnupad Temple in Gaya helps the souls of ancestors achieve Moksha (salvation) and breaks the cycle of rebirth.',
    officialInfo: 'The primary rituals take place at the Phalgu River, Vishnupad Temple, and Akshayavat. The Pitru Paksha Mela, held annually in September/October, is the most highly recommended period for these rituals.',
    itinerary: [
      { title: 'Preparation', desc: 'Meet the experienced priests assigned by Amit Guide. Arrangement of all necessary Samagri (ritual items).' },
      { title: 'Phalgu River Rituals', desc: 'Initial purifying bath and starting the Shraddha rituals on the banks of the Phalgu River.' },
      { title: 'Vishnupad Temple', desc: 'Perform the main Pind Daan inside the temple premises under the guidance of Acharyas, ensuring complete adherence to Vedic procedures.' }
    ]
  },
  {
    id: 4,
    duration: 'Ayodhya Darshan',
    title: 'Ayodhya Ram Mandir Tour',
    tag: 'Most Popular',
    price: 'Enquire',
    features: ['Darshan of Shri Ram Janmabhoomi', 'Major temples of Ayodhya', 'Family & Group Tours', 'Safe & Trusted Guide'],
    link: '/package/4',
    imageUrl: 'https://varanasiayodhya.com/images/ayodhya-ram-mandir.webp',
    overview: 'The Ram Mandir is a Hindu temple in Ayodhya, Uttar Pradesh, India, located at the sacred Ram Janmabhoomi, the widely believed birthplace of Rama, a principal deity of Hinduism. The temple architecture follows the traditional Nagara style, featuring intricate carvings, massive spires, and a grand sanctum that houses the idol of Ram Lalla (the infant Rama).',
    officialInfo: 'The temple complex is managed by the Shri Ram Janmabhoomi Teerth Kshetra trust. Standard Darshan timings are from 7:00 AM to 11:30 AM and 2:00 PM to 7:00 PM. Mobile phones and electronics are strictly prohibited inside.',
    itinerary: [
      { title: 'Arrival in Ayodhya', desc: 'Pick up and transfer. Proceed through security checkpoints with Amit Guide assistance.' },
      { title: 'Ram Mandir Darshan', desc: 'Guided entry to the Ram Janmabhoomi complex for the darshan of Ram Lalla.' },
      { title: 'Local Temples', desc: 'Visit to Hanuman Garhi, Kanak Bhawan, and the serene Saryu River ghats.' }
    ]
  },
  {
    id: 5,
    duration: 'Sacred Bath',
    title: 'Prayagraj Sangam Tour',
    tag: 'Pilgrimage',
    price: 'Enquire',
    features: ['Triveni Sangam bath', 'Bade Hanuman Ji', 'Visit to sacred places', 'Excellent Service'],
    link: '/package/5',
    imageUrl: 'https://varanasiayodhya.com/images/prayagraj-triveni-sangam-boat-seagulls-card.webp',
    overview: 'Prayagraj (formerly Allahabad) is home to the Triveni Sangam, the sacred confluence of three rivers: the Ganges, the Yamuna, and the mythical Saraswati. It is a site of immense spiritual importance in Hinduism. A bath here is believed to wash away all sins and free a person from the cycle of rebirth. It is the site of the historic Kumbh Mela.',
    officialInfo: 'Boats are required to reach the exact point of confluence. The site is open year-round, but water levels fluctuate depending on the season. The Bade Hanuman Temple (Leti Hanuman Ji) is located nearby and is highly revered.',
    itinerary: [
      { title: 'Boat to Sangam', desc: 'Board a private boat chartered by Amit Guide to navigate to the exact Triveni confluence.' },
      { title: 'Holy Snan', desc: 'Perform the sacred bath (snan) and conduct personal pujas on the floating platforms.' },
      { title: 'Sacred Tour', desc: 'Visit the unique reclining Bade Hanuman Ji temple and view the historic Allahabad Fort from the river.' }
    ]
  }
];

exports.createEnquiry = async (req, res) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    await newEnquiry.save();

    // Trigger scalable asynchronous notifications
    notifyAdminNewEnquiry(newEnquiry);

    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry: newEnquiry });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting enquiry', error: err.message });
  }
};

exports.getPackages = async (req, res) => {
  res.status(200).json(packages);
};

exports.getPackageById = async (req, res) => {
  const packageId = parseInt(req.params.id);
  const pkg = packages.find(p => p.id === packageId);
  if (pkg) {
    res.status(200).json(pkg);
  } else {
    res.status(404).json({ message: 'Package not found' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalEnquiries = await Enquiry.countDocuments();
    // Assuming base numbers to look impressive + actual enquiries
    const baseWebsiteVisitors = 15420;
    const baseHappyCustomers = 1100;
    
    res.status(200).json({
      enquiries: totalEnquiries + 850, // Base 850 + live enquiries
      visitors: baseWebsiteVisitors + (totalEnquiries * 12), // Simulated traffic ratio
      happyCustomers: baseHappyCustomers + Math.floor(totalEnquiries / 2)
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};
