const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const mockStore = require('../utils/mockStore');

const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id.toString());
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }

  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Access token missing'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'filmfolio_super_secret_jwt_key_2026_cinematic'
    );

    const userId = decoded.id ? decoded.id.toString() : '';

    if (mongoose.connection.readyState === 1 && isValidObjectId(userId)) {
      req.user = await User.findById(userId).select('-password');
    } else {
      req.user = mockStore.users.find((u) => (u._id || u.id).toString() === userId);
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User account associated with this token no longer exists'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Invalid or expired token'
    });
  }
};

module.exports = { protect };
