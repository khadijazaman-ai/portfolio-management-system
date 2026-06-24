const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Start the server after DB setup so models are registered correctly
(async () => {
  try {
    await connectDB();

    // Middleware
    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    // Basic sanity check route
    app.get('/', (req, res) => {
      res.json({ message: 'Portfolio Management API is running' });
    });

    // Define Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/portfolio', require('./routes/portfolio'));
    app.use('/api/profile', require('./routes/profile'));
    app.use('/api/skills', require('./routes/skills'));
    app.use('/api/projects', require('./routes/projects'));
    app.use('/api/dashboard', require('./routes/dashboard'));
    app.use('/api/categories', require('./routes/categories'));

    // Port configuration
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
