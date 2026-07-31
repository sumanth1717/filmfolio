const mongoose = require('mongoose');
const Equipment = require('../models/Equipment');
const mockStore = require('../utils/mockStore');

const isDbConnected = () => mongoose.connection.readyState === 1;
const getUserId = (u) => (u ? (u._id || u.id || u).toString() : '');

const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id.toString());
};

exports.getEquipment = async (req, res) => {
  try {
    const { category, type, minPrice, maxPrice, location, search, sort, userId } = req.query;

    const validUserId = userId && userId !== 'undefined' && userId !== 'null' ? userId : null;

    if (isDbConnected()) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (type && type !== 'all') query.type = type;
      if (validUserId && isValidObjectId(validUserId)) query.user = validUserId;

      if (minPrice || maxPrice) {
        query.pricePerDay = {};
        if (minPrice) query.pricePerDay.$gte = Number(minPrice);
        if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
      }

      if (location) query.location = { $regex: location, $options: 'i' };
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price_asc') sortOptions = { pricePerDay: 1 };
      if (sort === 'price_desc') sortOptions = { pricePerDay: -1 };
      if (sort === 'newest') sortOptions = { createdAt: -1 };

      const equipment = await Equipment.find(query)
        .populate('user', 'name email location profilePicture skills')
        .sort(sortOptions);

      return res.json({ success: true, count: equipment.length, equipment });
    } else {
      let result = [...mockStore.equipment];
      if (category && category !== 'All') result = result.filter((e) => e.category === category);
      if (type && type !== 'all') result = result.filter((e) => e.type === type);
      if (validUserId) {
        result = result.filter((e) => {
          const ownerId = getUserId(e.user);
          return ownerId === validUserId.toString();
        });
      }
      if (minPrice) result = result.filter((e) => e.pricePerDay >= Number(minPrice));
      if (maxPrice) result = result.filter((e) => e.pricePerDay <= Number(maxPrice));
      if (location) result = result.filter((e) => e.location && typeof e.location === 'string' && e.location.toLowerCase().includes(location.toLowerCase()));

      if (search) {
        const q = search.toLowerCase();
        result = result.filter((e) =>
          (e.title && typeof e.title === 'string' && e.title.toLowerCase().includes(q)) ||
          (e.description && typeof e.description === 'string' && e.description.toLowerCase().includes(q)) ||
          (e.category && typeof e.category === 'string' && e.category.toLowerCase().includes(q)) ||
          (e.location && typeof e.location === 'string' && e.location.toLowerCase().includes(q))
        );
      }

      if (sort === 'price_asc') result.sort((a, b) => a.pricePerDay - b.pricePerDay);
      if (sort === 'price_desc') result.sort((a, b) => b.pricePerDay - a.pricePerDay);

      return res.json({ success: true, count: result.length, equipment: result });
    }
  } catch (error) {
    console.error('[getEquipment Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid Equipment ID' });
    }

    if (isDbConnected() && isValidObjectId(id)) {
      const item = await Equipment.findById(id).populate('user', 'name email location profilePicture skills bio');
      if (!item) return res.status(404).json({ success: false, message: 'Equipment not found' });
      return res.json({ success: true, equipment: item });
    } else {
      const item = mockStore.equipment.find((e) => e._id && e._id.toString() === id.toString());
      if (!item) return res.status(404).json({ success: false, message: 'Equipment not found' });
      return res.json({ success: true, equipment: item });
    }
  } catch (error) {
    console.error('[getEquipmentById Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEquipment = async (req, res) => {
  try {
    const { title, category, description, pricePerDay, location, type, status } = req.body;
    const userId = getUserId(req.user);

    if (!title || !description || pricePerDay === undefined || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, pricePerDay, and location.'
      });
    }

    let image = 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&q=80&w=800';
    if (req.file) {
      image = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    if (isDbConnected() && isValidObjectId(userId)) {
      const item = await Equipment.create({
        user: userId,
        title,
        category: category || 'Camera',
        description,
        pricePerDay: Number(pricePerDay),
        location,
        type: type || 'available_to_rent',
        status: status || 'available',
        image
      });

      const populatedItem = await Equipment.findById(item._id).populate('user', 'name email location profilePicture skills');
      return res.status(201).json({ success: true, message: 'Equipment listed successfully', equipment: populatedItem });
    } else {
      const newItem = {
        _id: 'equip_' + Date.now(),
        user: req.user,
        title,
        category: category || 'Camera',
        description,
        pricePerDay: Number(pricePerDay),
        location,
        type: type || 'available_to_rent',
        status: status || 'available',
        image,
        createdAt: new Date().toISOString()
      };
      mockStore.equipment.unshift(newItem);
      mockStore.saveDiskStore();
      return res.status(201).json({ success: true, message: 'Equipment listed successfully', equipment: newItem });
    }
  } catch (error) {
    console.error('[createEquipment Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    const { title, category, description, pricePerDay, location, type, status } = req.body;
    const userId = getUserId(req.user);

    let image;
    if (req.file) {
      image = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    if (isDbConnected() && isValidObjectId(req.params.id)) {
      const item = await Equipment.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Equipment not found' });
      if (item.user.toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      if (title) item.title = title;
      if (category) item.category = category;
      if (description) item.description = description;
      if (pricePerDay !== undefined) item.pricePerDay = Number(pricePerDay);
      if (location) item.location = location;
      if (type) item.type = type;
      if (status) item.status = status;
      if (image) item.image = image;

      await item.save();
      const updatedItem = await Equipment.findById(item._id).populate('user', 'name email location profilePicture skills');
      return res.json({ success: true, message: 'Equipment updated', equipment: updatedItem });
    } else {
      const idx = mockStore.equipment.findIndex((e) => e._id && e._id.toString() === req.params.id.toString());
      if (idx === -1) return res.status(404).json({ success: false, message: 'Equipment not found' });

      const ownerId = getUserId(mockStore.equipment[idx].user);
      if (ownerId !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      if (title) mockStore.equipment[idx].title = title;
      if (category) mockStore.equipment[idx].category = category;
      if (description) mockStore.equipment[idx].description = description;
      if (pricePerDay !== undefined) mockStore.equipment[idx].pricePerDay = Number(pricePerDay);
      if (location) mockStore.equipment[idx].location = location;
      if (type) mockStore.equipment[idx].type = type;
      if (status) mockStore.equipment[idx].status = status;
      if (image) mockStore.equipment[idx].image = image;

      mockStore.saveDiskStore();

      return res.json({ success: true, message: 'Equipment updated', equipment: mockStore.equipment[idx] });
    }
  } catch (error) {
    console.error('[updateEquipment Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    const userId = getUserId(req.user);

    if (isDbConnected() && isValidObjectId(req.params.id)) {
      const item = await Equipment.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Equipment not found' });
      if (item.user.toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
      await item.deleteOne();
      return res.json({ success: true, message: 'Equipment deleted' });
    } else {
      const idx = mockStore.equipment.findIndex((e) => e._id && e._id.toString() === req.params.id.toString());
      if (idx === -1) return res.status(404).json({ success: false, message: 'Equipment not found' });

      const ownerId = getUserId(mockStore.equipment[idx].user);
      if (ownerId !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      mockStore.equipment.splice(idx, 1);
      mockStore.saveDiskStore();
      return res.json({ success: true, message: 'Equipment deleted' });
    }
  } catch (error) {
    console.error('[deleteEquipment Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
