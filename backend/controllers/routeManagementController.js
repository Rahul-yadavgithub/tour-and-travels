const PickupPoint = require('../models/PickupPoint');
const RouteTemplate = require('../models/RouteTemplate');
const { deleteImage } = require('../services/cloudinaryService');

// ==============================
// PICKUP POINTS
// ==============================

exports.getPickupPoints = async (req, res) => {
  try {
    const pickups = await PickupPoint.find().sort({ createdAt: -1 });
    res.status(200).json(pickups);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pickup points', error: err.message });
  }
};

exports.createPickupPoint = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.path;
      data.cloudinaryPublicId = req.file.filename;
    }
    const pickup = new PickupPoint(data);
    await pickup.save();
    res.status(201).json(pickup);
  } catch (err) {
    res.status(500).json({ message: 'Error creating pickup point', error: err.message });
  }
};

exports.updatePickupPoint = async (req, res) => {
  try {
    const data = { ...req.body };
    const existingPickup = await PickupPoint.findById(req.params.id);
    if (!existingPickup) return res.status(404).json({ message: 'Pickup point not found' });

    if (req.file) {
      if (existingPickup.cloudinaryPublicId) {
        await deleteImage(existingPickup.cloudinaryPublicId);
      }
      data.image = req.file.path;
      data.cloudinaryPublicId = req.file.filename;
    }

    const updated = await PickupPoint.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating pickup point', error: err.message });
  }
};

exports.deletePickupPoint = async (req, res) => {
  try {
    const pickup = await PickupPoint.findById(req.params.id);
    if (pickup && pickup.cloudinaryPublicId) {
      await deleteImage(pickup.cloudinaryPublicId);
    }
    await PickupPoint.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Pickup point deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting pickup point', error: err.message });
  }
};

// ==============================
// ROUTE TEMPLATES
// ==============================

exports.getRouteTemplates = async (req, res) => {
  try {
    const filter = {};
    if (req.query.pickupPointId) filter.pickupPointId = req.query.pickupPointId;
    
    const templates = await RouteTemplate.find(filter)
      .populate('pickupPointId')
      .populate('dropPointId');
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching route templates', error: err.message });
  }
};

exports.getRouteTemplateById = async (req, res) => {
  try {
    const template = await RouteTemplate.findById(req.params.id)
      .populate('pickupPointId')
      .populate('dropPointId');
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.status(200).json(template);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching template', error: err.message });
  }
};

exports.createRouteTemplate = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.stops && typeof data.stops === 'string') {
      data.stops = JSON.parse(data.stops);
    }

    // Attach uploaded files to the respective stops
    if (req.files && data.stops) {
      req.files.forEach(file => {
        // fieldname is expected to be 'stopImage_0', 'stopImage_1', etc.
        if (file.fieldname.startsWith('stopImage_')) {
          const idx = parseInt(file.fieldname.split('_')[1], 10);
          if (data.stops[idx]) {
            data.stops[idx].image = file.path;
            data.stops[idx].cloudinaryPublicId = file.filename;
          }
        }
      });
    }

    const template = new RouteTemplate(data);
    await template.save();
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ message: 'Error creating route template', error: err.message });
  }
};

exports.updateRouteTemplate = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.stops && typeof data.stops === 'string') {
      data.stops = JSON.parse(data.stops);
    }
    
    // Attach uploaded files to the respective stops
    if (req.files && data.stops) {
      req.files.forEach(file => {
        if (file.fieldname.startsWith('stopImage_')) {
          const idx = parseInt(file.fieldname.split('_')[1], 10);
          if (data.stops[idx]) {
            data.stops[idx].image = file.path;
            data.stops[idx].cloudinaryPublicId = file.filename;
          }
        }
      });
    }

    const template = await RouteTemplate.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json(template);
  } catch (err) {
    res.status(500).json({ message: 'Error updating route template', error: err.message });
  }
};

exports.deleteRouteTemplate = async (req, res) => {
  try {
    await RouteTemplate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Route template deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting route template', error: err.message });
  }
};
