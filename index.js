const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Habit Tracker Backend API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
