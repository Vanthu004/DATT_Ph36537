const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
