const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// ── CORS — allow ALL origins (Vercel, Netlify, localhost, any custom domain)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Handle preflight OPTIONS requests for ALL routes
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/replies', require('./routes/replyRoutes'));

// Healthcheck Route (also used for keep-alive ping)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FilmFolio Backend REST API',
    time: new Date().toISOString()
  });
});

// Global 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
});

// Global Error Middleware
app.use((err, req, res, next) => {
  console.error('[Global Express Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🎬 FilmFolio Backend Server Running on Port ${PORT}`);
  console.log(`🌐 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);

  // Self-ping every 14 minutes to prevent Render free tier from sleeping
  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    const https = require('https');
    setInterval(() => {
      const url = `${process.env.RENDER_EXTERNAL_URL}/api/health`;
      https.get(url, (res) => {
        console.log(`[Keep-Alive] Pinged ${url} — Status: ${res.statusCode}`);
      }).on('error', (e) => {
        console.warn('[Keep-Alive] Ping failed:', e.message);
      });
    }, 14 * 60 * 1000); // every 14 minutes
  }
});
