const PortfolioPhoto = require('../models/PortfolioPhoto');
const { deleteImage } = require('../services/cloudinaryService');

const getPhotos = async (req, res) => {
  try {
    const photos = await PortfolioPhoto.find({ guideId: req.guideId }).sort('displayOrder');
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching portfolio photos" });
  }
};

const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const count = await PortfolioPhoto.countDocuments({ guideId: req.guideId });

    const newPhoto = await PortfolioPhoto.create({
      guideId: req.guideId,
      imageUrl: req.file.path,
      cloudinaryPublicId: req.file.filename,
      displayOrder: count
    });

    res.status(201).json(newPhoto);
  } catch (error) {
    console.error("Upload Photo Error:", error);
    res.status(500).json({ message: "Error uploading photo" });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = req.resource; // attached by guideOwnership middleware

    // Delete from Cloudinary
    await deleteImage(photo.cloudinaryPublicId);

    // Delete from DB
    await PortfolioPhoto.findByIdAndDelete(photo._id);

    res.json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Delete Photo Error:", error);
    res.status(500).json({ message: "Error deleting photo" });
  }
};

const reorderPhotos = async (req, res) => {
  try {
    const { orderedIds } = req.body; // Array of photo IDs in new order

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds must be an array" });
    }

    // Bulk update displayOrder
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, guideId: req.guideId },
        update: { displayOrder: index }
      }
    }));

    await PortfolioPhoto.bulkWrite(bulkOps);

    res.json({ message: "Photos reordered successfully" });
  } catch (error) {
    console.error("Reorder Photos Error:", error);
    res.status(500).json({ message: "Error reordering photos" });
  }
};

// Public
const getPublicPhotos = async (req, res) => {
  try {
    const photos = await PortfolioPhoto.find({ guideId: req.params.guideId, status: 'active' }).sort('displayOrder');
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching photos" });
  }
};

const getAllPublicPhotos = async (req, res) => {
  try {
    const photos = await PortfolioPhoto.find({ status: 'active' }).limit(30);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all photos" });
  }
};

module.exports = {
  getPhotos,
  uploadPhoto,
  deletePhoto,
  reorderPhotos,
  getPublicPhotos,
  getAllPublicPhotos
};
