const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['available_to_rent', 'looking_to_rent'],
      default: 'available_to_rent'
    },
    title: {
      type: String,
      required: [true, 'Equipment title is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Camera', 'Lenses', 'Lighting', 'Audio', 'Grip & Rigging', 'Drones', 'Other'],
      default: 'Camera'
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price must be non-negative']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    zipCode: {
      type: String,
      default: '90028'
    },
    distanceMiles: {
      type: Number,
      default: 5
    },
    availableFrom: {
      type: Date
    },
    availableTo: {
      type: Date
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['available', 'rented'],
      default: 'available'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Equipment', EquipmentSchema);
