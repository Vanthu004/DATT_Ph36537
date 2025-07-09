const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Thay bằng biến môi trường nếu cần
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token. Authorization denied.' });
  }
};

module.exports = authMiddleware; 