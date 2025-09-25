const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/food', require('./routes/foodRoutes'));
app.use('/api/diet-charts', require('./routes/dietChartRoutes')); // <-- ADD THIS LINE
app.use('/api/recipes', require('./routes/recipeRoutes')); // <-- ADD THIS LINE
// ... other routes
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/reports', require('./routes/reportRoutes')); // <-- ADD THIS LINE
// ...

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));