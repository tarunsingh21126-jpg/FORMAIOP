const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the connection string in MONGODB_URI.
 * Throws if the connection fails so the caller can decide how to react
 * (e.g. exit the process on startup, or surface the error in a script).
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Copy backend/.env.example to backend/.env and configure it.'
    );
  }

  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(uri);

  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

  return conn;
}

module.exports = connectDB;
