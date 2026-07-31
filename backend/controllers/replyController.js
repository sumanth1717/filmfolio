const mongoose = require('mongoose');
const Reply = require('../models/Reply');
const Post = require('../models/Post');
const Equipment = require('../models/Equipment');
const mockStore = require('../utils/mockStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.sendReply = async (req, res) => {
  try {
    const { targetType, targetId, message, contactEmail, contactPhone, startDate, endDate, rentalDays } = req.body;

    if (!targetType || !targetId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Target type, target ID, and message are required.'
      });
    }

    let receiverId;
    let targetTitle = '';
    let pricePerDay = 0;
    let receiverObj;

    const daysCount = Number(rentalDays) > 0 ? Number(rentalDays) : 1;

    if (isDbConnected()) {
      if (targetType === 'Post') {
        const post = await Post.findById(targetId);
        if (!post) return res.status(404).json({ success: false, message: 'Target Post not found' });
        receiverId = post.user;
        targetTitle = post.title;
      } else if (targetType === 'Equipment') {
        const equip = await Equipment.findById(targetId);
        if (!equip) return res.status(404).json({ success: false, message: 'Target Equipment not found' });
        receiverId = equip.user;
        targetTitle = equip.title;
        pricePerDay = equip.pricePerDay || 0;
      }

      if (receiverId.toString() === req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'You cannot send an inquiry on your own listing.' });
      }

      const totalPrice = pricePerDay * daysCount;

      const reply = await Reply.create({
        sender: req.user._id,
        receiver: receiverId,
        targetType,
        targetId,
        targetTitle,
        message,
        contactEmail: contactEmail || req.user.email,
        contactPhone: contactPhone || '',
        startDate: startDate || '',
        endDate: endDate || '',
        rentalDays: daysCount,
        pricePerDay,
        totalPrice
      });

      const populatedReply = await Reply.findById(reply._id)
        .populate('sender', 'name email location profilePicture skills')
        .populate('receiver', 'name email location profilePicture');

      return res.status(201).json({ success: true, message: 'Reply sent successfully!', reply: populatedReply });
    } else {
      if (targetType === 'Post') {
        const post = mockStore.posts.find((p) => p._id.toString() === targetId.toString());
        if (!post) return res.status(404).json({ success: false, message: 'Target Post not found' });
        receiverObj = post.user;
        receiverId = receiverObj._id || receiverObj;
        targetTitle = post.title;
      } else if (targetType === 'Equipment') {
        const equip = mockStore.equipment.find((e) => e._id.toString() === targetId.toString());
        if (!equip) return res.status(404).json({ success: false, message: 'Target Equipment not found' });
        receiverObj = equip.user;
        receiverId = receiverObj._id || receiverObj;
        targetTitle = equip.title;
        pricePerDay = equip.pricePerDay || 0;
      }

      if (receiverId.toString() === req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'You cannot send an inquiry on your own listing.' });
      }

      const totalPrice = pricePerDay * daysCount;

      const newReply = {
        _id: 'reply_' + Date.now(),
        sender: req.user,
        receiver: receiverObj,
        targetType,
        targetId,
        targetTitle,
        message,
        contactEmail: contactEmail || req.user.email,
        contactPhone: contactPhone || '',
        startDate: startDate || '',
        endDate: endDate || '',
        rentalDays: daysCount,
        pricePerDay,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      mockStore.replies.unshift(newReply);
      return res.status(201).json({ success: true, message: 'Reply sent successfully! (Mock mode)', reply: newReply });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReceivedReplies = async (req, res) => {
  try {
    if (isDbConnected()) {
      const replies = await Reply.find({ receiver: req.user._id })
        .populate('sender', 'name email location profilePicture skills bio')
        .populate('receiver', 'name email location profilePicture')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: replies.length, replies });
    } else {
      const replies = mockStore.replies.filter(
        (r) => (r.receiver._id || r.receiver).toString() === req.user._id.toString()
      );
      return res.json({ success: true, count: replies.length, replies });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSentReplies = async (req, res) => {
  try {
    if (isDbConnected()) {
      const replies = await Reply.find({ sender: req.user._id })
        .populate('receiver', 'name email location profilePicture skills')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: replies.length, replies });
    } else {
      const replies = mockStore.replies.filter(
        (r) => (r.sender._id || r.sender).toString() === req.user._id.toString()
      );
      return res.json({ success: true, count: replies.length, replies });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReplyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (isDbConnected()) {
      const reply = await Reply.findById(req.params.id);
      if (!reply) return res.status(404).json({ success: false, message: 'Reply not found' });
      if (reply.receiver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      reply.status = status;
      await reply.save();
      return res.json({ success: true, message: `Status updated to ${status}`, reply });
    } else {
      const idx = mockStore.replies.findIndex((r) => r._id.toString() === req.params.id.toString());
      if (idx === -1) return res.status(404).json({ success: false, message: 'Reply not found' });

      mockStore.replies[idx].status = status;
      return res.json({ success: true, message: `Status updated to ${status}`, reply: mockStore.replies[idx] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
