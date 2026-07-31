const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getMe,
  getUserById,
  toggleFollow,
  toggleBlock,
  updateProfile,
  getDirectory
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/signup', upload.single('profilePicture'), signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users/:id', getUserById);
router.post('/follow/:id', protect, toggleFollow);
router.post('/block/:id', protect, toggleBlock);
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.get('/directory', getDirectory);

module.exports = router;
