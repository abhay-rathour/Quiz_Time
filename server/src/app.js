import express from 'express';

// Import Routers
import authRoutes from './routes/auth.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes);

app.get('/', (req, res) => {
    res.send('The quiz-time server is running !!!');
});

export default app;
