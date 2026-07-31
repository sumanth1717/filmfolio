const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/filmfolio');
    console.log(`[MongoDB] Connected to Host: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.error(`[MongoDB Error] Connection failure: ${error.message}`);
    // Do not exit process in dev so mock/fallback mode can function smoothly if mongo is offline
  }
};

module.exports = connectDB;
