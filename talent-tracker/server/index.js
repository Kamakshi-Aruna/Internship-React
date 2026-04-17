const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const candidatesRouter = require('./routes/candidates');
const jobsRouter = require('./routes/jobs');
const statsRouter = require('./routes/stats');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/candidates', candidatesRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/stats', statsRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Centralized error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));