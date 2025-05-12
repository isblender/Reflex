// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

require('dotenv').config(); // Load environment variables
const app = express();


// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
// Use authentication routes at /api
app.use('/api', require('./routes/auth'));

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});