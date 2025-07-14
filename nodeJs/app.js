const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/children', require('./routes/childRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/approvals', require('./routes/postApprovalRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/activity-logs', require('./routes/activityLogRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/assigned-child', require('./routes/assignedChildRouter'));
app.use('/api/images', require('./routes/imageRoutes'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
