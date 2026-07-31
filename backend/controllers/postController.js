const mongoose = require('mongoose');
const Post = require('../models/Post');
const mockStore = require('../utils/mockStore');

const isDbConnected = () => mongoose.connection.readyState === 1;
const getUserId = (u) => (u ? (u._id || u.id || u).toString() : '');

const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id.toString());
};

exports.getPosts = async (req, res) => {
  try {
    const { type, search, location, userId } = req.query;
    const validUserId = userId && userId !== 'undefined' && userId !== 'null' ? userId : null;

    let posts = [];

    if (isDbConnected()) {
      try {
        let query = {};
        if (type && type !== 'all') query.type = type;
        if (validUserId && isValidObjectId(validUserId)) query.user = validUserId;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { roleNeeded: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } }
          ];
        }
        posts = await Post.find(query)
          .populate('user', 'name email location profilePicture skills')
          .sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn('[getPosts DB Warning]:', dbErr.message);
        posts = [];
      }
    }

    if (!posts || posts.length === 0) {
      let result = [...mockStore.posts];
      if (type && type !== 'all') result = result.filter((p) => p.type === type);
      if (validUserId) {
        result = result.filter((p) => {
          const authorId = getUserId(p.user);
          return authorId === validUserId.toString();
        });
      }
      if (location) result = result.filter((p) => p.location && typeof p.location === 'string' && p.location.toLowerCase().includes(location.toLowerCase()));
      if (search) {
        const q = search.toLowerCase();
        result = result.filter((p) =>
          (p.title && typeof p.title === 'string' && p.title.toLowerCase().includes(q)) ||
          (p.description && typeof p.description === 'string' && p.description.toLowerCase().includes(q)) ||
          (p.roleNeeded && typeof p.roleNeeded === 'string' && p.roleNeeded.toLowerCase().includes(q)) ||
          (p.location && typeof p.location === 'string' && p.location.toLowerCase().includes(q))
        );
      }

      posts = result.map((p) => {
        const authorId = getUserId(p.user);
        const fullUser = mockStore.users.find((u) => getUserId(u) === authorId) || p.user;
        const userCopy = typeof fullUser === 'object' ? { ...fullUser } : { _id: authorId, name: 'Filmmaker' };
        delete userCopy.password;
        return { ...p, user: userCopy };
      });
    }

    return res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    console.error('[getPosts Recovery]:', error.message);
    const fallbackPosts = mockStore.posts.map((p) => {
      const authorId = getUserId(p.user);
      const fullUser = mockStore.users.find((u) => getUserId(u) === authorId) || p.user;
      const userCopy = typeof fullUser === 'object' ? { ...fullUser } : { _id: authorId, name: 'Filmmaker' };
      delete userCopy.password;
      return { ...p, user: userCopy };
    });
    return res.json({ success: true, count: fallbackPosts.length, posts: fallbackPosts });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid Post ID' });
    }

    if (isDbConnected() && isValidObjectId(id)) {
      try {
        const post = await Post.findById(id).populate('user', 'name email location profilePicture skills bio');
        if (post) return res.json({ success: true, post });
      } catch (e) {
        // Fallback to mockStore
      }
    }

    const post = mockStore.posts.find((p) => p._id && p._id.toString() === id.toString());
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const authorId = getUserId(post.user);
    const fullUser = mockStore.users.find((u) => getUserId(u) === authorId) || post.user;
    const userCopy = typeof fullUser === 'object' ? { ...fullUser } : { _id: authorId, name: 'Filmmaker' };
    delete userCopy.password;

    return res.json({ success: true, post: { ...post, user: userCopy } });
  } catch (error) {
    console.error('[getPostById Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { type, title, description, roleNeeded, location } = req.body;
    const userId = getUserId(req.user);

    if (!title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and post type are required.'
      });
    }

    let image = '';
    if (req.file) {
      image = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    if (isDbConnected() && isValidObjectId(userId)) {
      try {
        const post = await Post.create({
          user: userId,
          type,
          title,
          description,
          roleNeeded: roleNeeded || 'Filmmaker / Crew',
          location: location || req.user.location || 'Vijayawada, AP',
          image
        });

        const populatedPost = await Post.findById(post._id).populate(
          'user',
          'name email location profilePicture skills'
        );

        return res.status(201).json({
          success: true,
          message: 'Post published successfully',
          post: populatedPost
        });
      } catch (e) {
        // Fallback to mockStore creation below
      }
    }

    const userPayload = { ...req.user };
    delete userPayload.password;

    const newPost = {
      _id: 'post_' + Date.now(),
      user: userPayload,
      type,
      title,
      description,
      roleNeeded: roleNeeded || 'Filmmaker / Crew',
      location: location || req.user.location || 'Vijayawada, AP',
      image,
      createdAt: new Date().toISOString()
    };
    mockStore.posts.unshift(newPost);
    mockStore.saveDiskStore();

    return res.status(201).json({
      success: true,
      message: 'Post published successfully',
      post: newPost
    });
  } catch (error) {
    console.error('[createPost Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { type, title, description, roleNeeded, location } = req.body;
    const userId = getUserId(req.user);

    let image;
    if (req.file) {
      image = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    if (isDbConnected() && isValidObjectId(req.params.id)) {
      try {
        const post = await Post.findById(req.params.id);
        if (post) {
          if (post.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
          }

          if (type) post.type = type;
          if (title) post.title = title;
          if (description) post.description = description;
          if (roleNeeded) post.roleNeeded = roleNeeded;
          if (location) post.location = location;
          if (image) post.image = image;

          await post.save();
          const updatedPost = await Post.findById(post._id).populate('user', 'name email location profilePicture skills');
          return res.json({ success: true, message: 'Post updated', post: updatedPost });
        }
      } catch (e) {
        // Fallback
      }
    }

    const idx = mockStore.posts.findIndex((p) => p._id && p._id.toString() === req.params.id.toString());
    if (idx === -1) return res.status(404).json({ success: false, message: 'Post not found' });

    const authorId = getUserId(mockStore.posts[idx].user);
    if (authorId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (type) mockStore.posts[idx].type = type;
    if (title) mockStore.posts[idx].title = title;
    if (description) mockStore.posts[idx].description = description;
    if (roleNeeded) mockStore.posts[idx].roleNeeded = roleNeeded;
    if (location) mockStore.posts[idx].location = location;
    if (image) mockStore.posts[idx].image = image;

    mockStore.saveDiskStore();

    return res.json({ success: true, message: 'Post updated', post: mockStore.posts[idx] });
  } catch (error) {
    console.error('[updatePost Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const userId = getUserId(req.user);

    if (isDbConnected() && isValidObjectId(req.params.id)) {
      try {
        const post = await Post.findById(req.params.id);
        if (post) {
          if (post.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
          }
          await post.deleteOne();
          return res.json({ success: true, message: 'Post removed successfully' });
        }
      } catch (e) {
        // Fallback
      }
    }

    const idx = mockStore.posts.findIndex((p) => p._id && p._id.toString() === req.params.id.toString());
    if (idx === -1) return res.status(404).json({ success: false, message: 'Post not found' });

    const authorId = getUserId(mockStore.posts[idx].user);
    if (authorId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    mockStore.posts.splice(idx, 1);
    mockStore.saveDiskStore();
    return res.json({ success: true, message: 'Post removed successfully' });
  } catch (error) {
    console.error('[deletePost Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.reportPost = async (req, res) => {
  try {
    const { reason, details } = req.body;
    const postId = req.params.id;

    const reportObj = {
      _id: 'report_' + Date.now(),
      targetType: 'Post',
      targetId: postId,
      reporterId: getUserId(req.user) || 'anonymous',
      reason: reason || 'Inappropriate content or spam',
      details: details || '',
      createdAt: new Date().toISOString()
    };

    if (!mockStore.reports) mockStore.reports = [];
    mockStore.reports.push(reportObj);
    mockStore.saveDiskStore();

    return res.json({
      success: true,
      message: 'Thank you. Your report has been submitted to moderation.'
    });
  } catch (error) {
    console.error('[reportPost Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
