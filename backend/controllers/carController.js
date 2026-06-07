const Car = require('../models/Car');
const { deleteImage } = require('../services/cloudinaryService');

const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ guideId: req.guideId }).sort('-createdAt');
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars" });
  }
};

const createCar = async (req, res) => {
  try {
    const carData = { ...req.body, guideId: req.guideId };

    if (req.files && req.files.length > 0) {
      carData.photoUrls = req.files.map(file => file.path);
      carData.cloudinaryPublicIds = req.files.map(file => file.filename);
    }

    const newCar = await Car.create(carData);
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Create Car Error:", error);
    res.status(500).json({ message: "Error creating car" });
  }
};

const updateCar = async (req, res) => {
  try {
    const car = req.resource; // from ownership middleware
    const updates = { ...req.body };

    if (req.files && req.files.length > 0) {
      // If new images are uploaded, delete the old ones
      if (car.cloudinaryPublicIds && car.cloudinaryPublicIds.length > 0) {
        for (const publicId of car.cloudinaryPublicIds) {
          await deleteImage(publicId).catch(err => console.error(err));
        }
      } else if (car.cloudinaryPublicId) {
        // Fallback for old schema
        await deleteImage(car.cloudinaryPublicId).catch(err => console.error(err));
      }
      updates.photoUrls = req.files.map(file => file.path);
      updates.cloudinaryPublicIds = req.files.map(file => file.filename);
    }

    Object.assign(car, updates);
    await car.save();

    res.json(car);
  } catch (error) {
    console.error("Update Car Error:", error);
    res.status(500).json({ message: "Error updating car" });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = req.resource;

    if (car.cloudinaryPublicIds && car.cloudinaryPublicIds.length > 0) {
      for (const publicId of car.cloudinaryPublicIds) {
        await deleteImage(publicId).catch(err => console.error(err));
      }
    } else if (car.cloudinaryPublicId) {
      await deleteImage(car.cloudinaryPublicId).catch(err => console.error(err));
    }

    await Car.findByIdAndDelete(car._id);
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Delete Car Error:", error);
    res.status(500).json({ message: "Error deleting car" });
  }
};

// Public
const getPublicCars = async (req, res) => {
  try {
    const cars = await Car.find({ guideId: req.params.guideId, status: 'active' });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars" });
  }
};

const getAllPublicCars = async (req, res) => {
  try {
    const cars = await Car.find({ status: 'active' }).sort('-createdAt');
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all cars" });
  }
};

module.exports = {
  getCars,
  createCar,
  updateCar,
  deleteCar,
  getPublicCars,
  getAllPublicCars
};
