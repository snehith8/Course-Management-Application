const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Route imports
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'Server is running' });
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
