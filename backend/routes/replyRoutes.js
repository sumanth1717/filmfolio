const express = require('express');
const router = express.Router();
const {
  sendReply,
  getReceivedReplies,
  getSentReplies,
  updateReplyStatus
} = require('../controllers/replyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendReply);
router.get('/received', protect, getReceivedReplies);
router.get('/sent', protect, getSentReplies);
router.put('/:id/status', protect, updateReplyStatus);

module.exports = router;
