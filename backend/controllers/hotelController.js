const Hotel = require('../models/Hotel');
const { deleteImage } = require('../services/cloudinaryService');

const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ guideId: req.guideId }).sort('-createdAt');
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

const createHotel = async (req, res) => {
  try {
    const hotelData = { ...req.body, guideId: req.guideId };

    // If facilities comes as string (multipart form), parse it
    if (typeof hotelData.facilities === 'string') {
      try { hotelData.facilities = JSON.parse(hotelData.facilities); } catch(e){}
    }

    if (req.files && req.files.length > 0) {
      hotelData.photoUrls = req.files.map(file => file.path);
      hotelData.cloudinaryPublicIds = req.files.map(file => file.filename);
    }

    const newHotel = await Hotel.create(hotelData);
    res.status(201).json(newHotel);
  } catch (error) {
    console.error("Create Hotel Error:", error);
    res.status(500).json({ message: "Error creating hotel" });
  }
};

const updateHotel = async (req, res) => {
  try {
    const hotel = req.resource;
    const updates = { ...req.body };

    if (typeof updates.facilities === 'string') {
      try { updates.facilities = JSON.parse(updates.facilities); } catch(e){}
    }

    if (req.files && req.files.length > 0) {
      if (hotel.cloudinaryPublicIds && hotel.cloudinaryPublicIds.length > 0) {
        for (const publicId of hotel.cloudinaryPublicIds) {
          await deleteImage(publicId).catch(err => console.error(err));
        }
      } else if (hotel.cloudinaryPublicId) {
        await deleteImage(hotel.cloudinaryPublicId).catch(err => console.error(err));
      }
      updates.photoUrls = req.files.map(file => file.path);
      updates.cloudinaryPublicIds = req.files.map(file => file.filename);
    }

    Object.assign(hotel, updates);
    await hotel.save();

    res.json(hotel);
  } catch (error) {
    console.error("Update Hotel Error:", error);
    res.status(500).json({ message: "Error updating hotel" });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const hotel = req.resource;

    if (hotel.cloudinaryPublicIds && hotel.cloudinaryPublicIds.length > 0) {
      for (const publicId of hotel.cloudinaryPublicIds) {
        await deleteImage(publicId).catch(err => console.error(err));
      }
    } else if (hotel.cloudinaryPublicId) {
      await deleteImage(hotel.cloudinaryPublicId).catch(err => console.error(err));
    }

    await Hotel.findByIdAndDelete(hotel._id);
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Delete Hotel Error:", error);
    res.status(500).json({ message: "Error deleting hotel" });
  }
};

// Public
const getPublicHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ guideId: req.params.guideId, status: 'active' });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

const getAllPublicHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ status: 'active' }).sort('-createdAt');
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all hotels" });
  }
};

module.exports = {
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  getPublicHotels,
  getAllPublicHotels
};
