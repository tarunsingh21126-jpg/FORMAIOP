require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/db');
const formRoutes = require('./src/routes/formRoutes');
const applicationRoutes = require('./src/routes/application.routes');
const aiRoutes = require('./src/routes/aiRoutes');
const {
  errorHandler,
  notFoundHandler
} = require('./src/middleware/errorHandler');

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (Postman, curl, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS policy: Origin ${origin} is not allowed`)
      );
    },
    credentials: true
  })
);

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok'
    }
  });
});

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Starts the application.
 */
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`FormAI backend running on http://localhost:${PORT}`);
      console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start server only when this file is executed directly.
// This makes the app easier to test with tools such as Jest/Supertest.
if (require.main === module) {
  startServer();
}

module.exports = app;
