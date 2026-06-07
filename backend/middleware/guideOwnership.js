const guideOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: "Resource ID is required." });
      }

      const resource = await model.findById(id);

      if (!resource) {
        return res.status(404).json({ message: "Resource not found." });
      }

      // Check if the resource belongs to the currently authenticated guide
      // If resource.guideId is not present, it's considered a global resource (like global reviews) that the admin/guide can manage
      if (resource.guideId && resource.guideId.toString() !== req.guideId.toString()) {
        return res.status(403).json({ message: "Forbidden: You do not own this resource." });
      }

      // Pass the resource to the request to avoid re-fetching in the controller
      req.resource = resource;
      next();
    } catch (error) {
      console.error("Ownership Validation Error:", error);
      res.status(500).json({ message: "Internal server error during ownership validation." });
    }
  };
};

module.exports = guideOwnership;
