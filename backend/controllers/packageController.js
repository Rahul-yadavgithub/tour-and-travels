const Package = require('../models/Package');
const { deleteImage } = require('../services/cloudinaryService');

// --- Public Routes ---

exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find({ active: true }).sort({ legacyId: 1, createdAt: -1 });
    res.status(200).json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching packages', error: err.message });
  }
};

exports.getPackageById = async (req, res) => {
  try {
    const idParam = req.params.id;
    let pkg;
    
    // Support finding by the legacy numeric ID or the new MongoDB ObjectId
    if (!isNaN(idParam)) {
      pkg = await Package.findOne({ legacyId: parseInt(idParam), active: true });
    } else if (idParam.match(/^[0-9a-fA-F]{24}$/)) {
      pkg = await Package.findById(idParam);
    }
    
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching package', error: err.message });
  }
};


// --- Protected Admin Routes ---

exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent overriding structural integrity fields if needed, 
    // but the schema is flexible.
    const updateData = { ...req.body, updatedBy: req.user?.id || 'Admin' };
    
    let updatedPkg;
    if (!isNaN(id)) {
      updatedPkg = await Package.findOneAndUpdate({ legacyId: parseInt(id) }, updateData, { new: true });
    } else {
      updatedPkg = await Package.findByIdAndUpdate(id, updateData, { new: true });
    }

    if (!updatedPkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json({ message: 'Package updated successfully', package: updatedPkg });
  } catch (err) {
    res.status(500).json({ message: 'Error updating package', error: err.message });
  }
};

exports.uploadPackageImages = async (req, res) => {
  try {
    const { id } = req.params;
    let pkg;
    
    if (!isNaN(id)) {
      pkg = await Package.findOne({ legacyId: parseInt(id) });
    } else {
      pkg = await Package.findById(id);
    }

    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const newImageUrls = req.files.map(file => file.path);
    const newPublicIds = req.files.map(file => file.filename);

    pkg.imageUrls = [...(pkg.imageUrls || []), ...newImageUrls];
    pkg.cloudinaryPublicIds = [...(pkg.cloudinaryPublicIds || []), ...newPublicIds];

    await pkg.save();

    res.status(200).json({ 
      message: 'Images uploaded successfully', 
      package: pkg,
      uploadedUrls: newImageUrls 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading images', error: err.message });
  }
};

exports.updatePackagePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPrice, oldPrice } = req.body;
    
    if (currentPrice === undefined) {
      return res.status(400).json({ message: 'currentPrice is required' });
    }

    let query = !isNaN(id) ? { legacyId: parseInt(id) } : { _id: id };
    
    const pkg = await Package.findOne(query);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    pkg.currentPrice = currentPrice;
    if (oldPrice !== undefined) pkg.oldPrice = oldPrice;
    
    await pkg.save(); // Triggers the pre-save hook for discount percentage

    res.status(200).json({ message: 'Price updated dynamically', package: pkg });
  } catch (err) {
    res.status(500).json({ message: 'Error updating price', error: err.message });
  }
};

exports.deletePackageImage = async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    let pkg;
    
    if (!isNaN(id)) {
      pkg = await Package.findOne({ legacyId: parseInt(id) });
    } else {
      pkg = await Package.findById(id);
    }

    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const index = parseInt(imageIndex);
    if (isNaN(index) || index < 0 || index >= pkg.imageUrls.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }

    // Try to delete from Cloudinary if a public ID exists at that index
    if (pkg.cloudinaryPublicIds && pkg.cloudinaryPublicIds[index]) {
      const publicId = pkg.cloudinaryPublicIds[index];
      await deleteImage(publicId).catch(err => console.error("Cloudinary deletion error:", err));
      pkg.cloudinaryPublicIds.splice(index, 1);
    }

    pkg.imageUrls.splice(index, 1);
    await pkg.save();

    res.status(200).json({ message: 'Image deleted successfully', package: pkg });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting image', error: err.message });
  }
};
