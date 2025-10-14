const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const researchProgressRoutes = require('./src/routes/researchProgress');
app.use('/api/research', researchProgressRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB and start server
async function start() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lgbt_db';
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

start();
