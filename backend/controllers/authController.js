const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mockStore = require('../utils/mockStore');

const isDbConnected = () => mongoose.connection.readyState === 1;
const getUserId = (u) => (u ? (u._id || u.id || u).toString() : '');

const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id.toString());
};

const generateToken = (id) => {
  return jwt.sign(
    { id: id ? id.toString() : '' },
    process.env.JWT_SECRET || 'filmfolio_super_secret_jwt_key_2026_cinematic',
    { expiresIn: '30d' }
  );
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, bio, location, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.'
      });
    }

    let parsedSkills = ['Filmmaker'];
    if (skills) {
      if (Array.isArray(skills)) {
        parsedSkills = skills;
      } else if (typeof skills === 'string') {
        parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    let profilePicture = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
    if (req.file) {
      profilePicture = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        bio: bio || '',
        location: location || 'Vijayawada, Andhra Pradesh',
        skills: parsedSkills,
        profilePicture,
        following: [],
        blockedUsers: []
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user
      });
    } else {
      const existingUser = mockStore.users.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        bio: bio || '',
        location: location || 'Vijayawada, Andhra Pradesh',
        skills: parsedSkills,
        profilePicture,
        following: [],
        blockedUsers: [],
        createdAt: new Date().toISOString()
      };

      mockStore.users.push(newUser);
      mockStore.saveDiskStore();

      const token = generateToken(newUser._id);
      const userPayload = { ...newUser };
      delete userPayload.password;

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: userPayload
      });
    }
  } catch (error) {
    console.error('[Signup Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during signup'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email address and password.'
      });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. User not found.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Password incorrect.'
        });
      }

      const token = generateToken(user._id);

      return res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user
      });
    } else {
      const user = mockStore.users.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. User not found.'
        });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Password incorrect.'
        });
      }

      const token = generateToken(user._id);
      const userPayload = { ...user };
      delete userPayload.password;

      return res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: userPayload
      });
    }
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    if (isDbConnected() && isValidObjectId(userId)) {
      const user = await User.findById(userId);
      return res.json({ success: true, user });
    } else {
      const userPayload = { ...req.user };
      delete userPayload.password;
      return res.json({ success: true, user: userPayload });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user profile'
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid User ID' });
    }

    if (isDbConnected() && isValidObjectId(id)) {
      const user = await User.findById(id).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, user });
    } else {
      const user = mockStore.users.find((u) => getUserId(u) === id.toString());
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      const userPayload = { ...user };
      delete userPayload.password;
      return res.json({ success: true, user: userPayload });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user profile'
    });
  }
};

// Toggle Follow / Unfollow User
exports.toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id ? req.params.id.toString() : '';
    const currentUserId = getUserId(req.user);

    if (!targetUserId || targetUserId === 'undefined' || targetUserId === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid target user ID' });
    }

    if (targetUserId === currentUserId) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself.' });
    }

    if (isDbConnected() && isValidObjectId(currentUserId)) {
      const user = await User.findById(currentUserId);
      if (!user) return res.status(404).json({ success: false, message: 'User account not found' });

      if (!user.following) user.following = [];
      const isFollowing = user.following.includes(targetUserId);

      if (isFollowing) {
        user.following = user.following.filter((id) => id !== targetUserId);
      } else {
        user.following.push(targetUserId);
      }

      await user.save();
      return res.json({
        success: true,
        isFollowing: !isFollowing,
        message: !isFollowing ? 'Filmmaker followed' : 'Unfollowed filmmaker',
        following: user.following
      });
    } else {
      const userIdx = mockStore.users.findIndex((u) => getUserId(u) === currentUserId);
      if (userIdx === -1) return res.status(404).json({ success: false, message: 'User account not found' });

      if (!mockStore.users[userIdx].following) mockStore.users[userIdx].following = [];
      const followingList = mockStore.users[userIdx].following;
      const isFollowing = followingList.includes(targetUserId);

      if (isFollowing) {
        mockStore.users[userIdx].following = followingList.filter((id) => id !== targetUserId);
      } else {
        mockStore.users[userIdx].following.push(targetUserId);
      }

      mockStore.saveDiskStore();

      return res.json({
        success: true,
        isFollowing: !isFollowing,
        message: !isFollowing ? 'Filmmaker followed' : 'Unfollowed filmmaker',
        following: mockStore.users[userIdx].following
      });
    }
  } catch (error) {
    console.error('[toggleFollow Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Block / Unblock User
exports.toggleBlock = async (req, res) => {
  try {
    const targetUserId = req.params.id ? req.params.id.toString() : '';
    const currentUserId = getUserId(req.user);

    if (!targetUserId || targetUserId === 'undefined' || targetUserId === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid target user ID' });
    }

    if (targetUserId === currentUserId) {
      return res.status(400).json({ success: false, message: 'You cannot block yourself.' });
    }

    if (isDbConnected() && isValidObjectId(currentUserId)) {
      const user = await User.findById(currentUserId);
      if (!user) return res.status(404).json({ success: false, message: 'User account not found' });

      if (!user.blockedUsers) user.blockedUsers = [];
      const isBlocked = user.blockedUsers.includes(targetUserId);

      if (isBlocked) {
        user.blockedUsers = user.blockedUsers.filter((id) => id !== targetUserId);
      } else {
        user.blockedUsers.push(targetUserId);
      }

      await user.save();
      return res.json({
        success: true,
        isBlocked: !isBlocked,
        message: !isBlocked ? 'User blocked' : 'User unblocked',
        blockedUsers: user.blockedUsers
      });
    } else {
      const userIdx = mockStore.users.findIndex((u) => getUserId(u) === currentUserId);
      if (userIdx === -1) return res.status(404).json({ success: false, message: 'User account not found' });

      if (!mockStore.users[userIdx].blockedUsers) mockStore.users[userIdx].blockedUsers = [];
      const blockedList = mockStore.users[userIdx].blockedUsers;
      const isBlocked = blockedList.includes(targetUserId);

      if (isBlocked) {
        mockStore.users[userIdx].blockedUsers = blockedList.filter((id) => id !== targetUserId);
      } else {
        mockStore.users[userIdx].blockedUsers.push(targetUserId);
      }

      mockStore.saveDiskStore();

      return res.json({
        success: true,
        isBlocked: !isBlocked,
        message: !isBlocked ? 'User blocked' : 'User unblocked',
        blockedUsers: mockStore.users[userIdx].blockedUsers
      });
    }
  } catch (error) {
    console.error('[toggleBlock Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, location, skills } = req.body;
    const userId = getUserId(req.user);

    let parsedSkills;
    if (skills) {
      if (Array.isArray(skills)) {
        parsedSkills = skills;
      } else if (typeof skills === 'string') {
        parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    let profilePicture;
    if (req.file) {
      profilePicture = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    if (isDbConnected() && isValidObjectId(userId)) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (location) user.location = location;
      if (parsedSkills) user.skills = parsedSkills;
      if (profilePicture) user.profilePicture = profilePicture;

      await user.save();
      return res.json({ success: true, message: 'Profile updated successfully', user });
    } else {
      const userIdx = mockStore.users.findIndex((u) => getUserId(u) === userId);
      if (userIdx === -1) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) mockStore.users[userIdx].name = name;
      if (bio !== undefined) mockStore.users[userIdx].bio = bio;
      if (location) mockStore.users[userIdx].location = location;
      if (parsedSkills) mockStore.users[userIdx].skills = parsedSkills;
      if (profilePicture) mockStore.users[userIdx].profilePicture = profilePicture;

      mockStore.saveDiskStore();

      const userPayload = { ...mockStore.users[userIdx] };
      delete userPayload.password;

      return res.json({ success: true, message: 'Profile updated successfully', user: userPayload });
    }
  } catch (error) {
    console.error('[updateProfile Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating profile'
    });
  }
};

exports.getDirectory = async (req, res) => {
  try {
    const { location, skill, search } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (location) query.location = { $regex: location, $options: 'i' };
      if (skill) query.skills = { $regex: skill, $options: 'i' };
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { skills: { $regex: search, $options: 'i' } }
        ];
      }
      const filmmakers = await User.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: filmmakers.length, filmmakers });
    } else {
      let result = [...mockStore.users];
      if (location) {
        result = result.filter((u) => u.location && u.location.toLowerCase().includes(location.toLowerCase()));
      }
      if (skill) {
        result = result.filter((u) => u.skills && u.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase())));
      }
      if (search) {
        const q = search.toLowerCase();
        result = result.filter((u) =>
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.bio && u.bio.toLowerCase().includes(q)) ||
          (u.location && u.location.toLowerCase().includes(q)) ||
          (u.skills && u.skills.some((s) => s.toLowerCase().includes(q)))
        );
      }
      const filmmakers = result.map((u) => {
        const copy = { ...u };
        delete copy.password;
        return copy;
      });
      return res.json({ success: true, count: filmmakers.length, filmmakers });
    }
  } catch (error) {
    console.error('[getDirectory Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching directory'
    });
  }
};
