const express = require('express');
const router = express.Router();
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} = require('../controllers/equipmentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getEquipment);
router.get('/:id', getEquipmentById);
router.post('/', protect, upload.single('image'), createEquipment);
router.put('/:id', protect, upload.single('image'), updateEquipment);
router.delete('/:id', protect, deleteEquipment);

module.exports = router;
