const cloudinary = require('../config/cloudinary');

// Upload image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads',
    });
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ error: 'No public_id provided' });
    await cloudinary.uploader.destroy(public_id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 