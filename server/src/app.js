import express from 'express';

// Import Routers
import authRoutes from './routes/auth.js';
import groupRoutes from './routes/group.js';
import userGroupRoutes from './routes/userGroup.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/user-group', userGroupRoutes);
app.use('/api/group', groupRoutes);

app.get('/', (req, res) => {
    res.send('The quiz-time server is running !!!');
});

export default app;
