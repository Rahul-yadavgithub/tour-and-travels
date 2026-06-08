const Package = require('../models/Package');
const { deleteImage } = require('../services/cloudinaryService');
const AIContentService = require('../services/aiContentService');

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
    
    const updateData = { ...req.body, updatedBy: req.user?.id || 'Admin' };
    
    let query = !isNaN(id) ? { legacyId: parseInt(id) } : { _id: id };
    const existingPkg = await Package.findOne(query);
    
    if (!existingPkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Simple pricing logic: Admin sets currentPrice and oldPrice directly.
    // Auto-calculate discountPercentage from those values.
    const currentPrice = updateData.currentPrice !== undefined 
      ? Number(updateData.currentPrice) 
      : existingPkg.currentPrice;
    const oldPrice = updateData.oldPrice !== undefined 
      ? (updateData.oldPrice === '' || updateData.oldPrice === null ? null : Number(updateData.oldPrice))
      : existingPkg.oldPrice;

    if (oldPrice && currentPrice && oldPrice > currentPrice) {
      // Auto-calculate discount unless admin explicitly set a manual override
      if (updateData.discountPercentage === undefined || updateData.discountPercentage === '' || updateData.discountPercentage === null) {
        updateData.discountPercentage = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
      }
    } else if (!oldPrice || oldPrice <= currentPrice) {
      // No valid old price or old price <= current price means no discount
      updateData.discountPercentage = 0;
    }

    const updatedPkg = await Package.findOneAndUpdate(query, updateData, { new: true });

    res.status(200).json({ message: 'Package updated successfully', package: updatedPkg });
  } catch (err) {
    res.status(500).json({ message: 'Error updating package', error: err.message });
  }
};

exports.createAIPackage = async (req, res) => {
  try {
    const { destinationName, city, state, country, imageCount } = req.body;

    if (!destinationName) {
      return res.status(400).json({ message: 'destinationName is required' });
    }

    // 1. Fetch OSM Data
    let osmData = null;
    try {
      osmData = await AIContentService.getOSMPlaceData(destinationName);
    } catch (e) {
      console.warn('Failed to fetch OSM Data', e);
    }

    // 2. Fetch Unsplash Images
    let unsplashImages = [];
    if (process.env.UNSPLASH_ACCESS_KEY) {
      unsplashImages = await AIContentService.getUnsplashImages(destinationName, imageCount || 5);
    }

    // 3. Generate AI Content
    const generatedData = await AIContentService.generateOpenRouterContent(
      destinationName,
      city,
      state,
      country,
      osmData
    );

    // 4. Create Package Document
    const newPackage = new Package({
      title: generatedData.name || destinationName,
      location: city || generatedData.location?.city || destinationName,
      duration: generatedData.visitInfo?.idealVisitDuration || 'Flexible',
      tag: 'AI Premium',
      overview: generatedData.overview?.shortDescription || '',
      imageUrls: unsplashImages.map(img => img.url),
      aiContent: generatedData,
      currentPrice: 4999 // Default price, admin can edit later
    });

    await newPackage.save();

    res.status(201).json({ 
      message: 'AI Package generated and saved successfully', 
      package: newPackage 
    });
  } catch (err) {
    console.error('Error generating AI Package:', err);
    res.status(500).json({ message: 'Error generating AI Package', error: err.message });
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

exports.deletePackage = async (req, res) => {
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

    // Attempt to delete associated images from Cloudinary if any exist
    if (pkg.cloudinaryPublicIds && pkg.cloudinaryPublicIds.length > 0) {
      for (const publicId of pkg.cloudinaryPublicIds) {
        if (publicId) {
          await deleteImage(publicId).catch(err => console.error("Cloudinary deletion error:", err));
        }
      }
    }

    await Package.findByIdAndDelete(pkg._id);
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (err) {
    console.error('Error deleting package:', err);
    res.status(500).json({ message: 'Error deleting package', error: err.message });
  }
};
