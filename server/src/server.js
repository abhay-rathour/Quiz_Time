import http from 'http';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import app from './app.js';

// Load environment variables
dotenv.config();

initDB()
    .then(() => {
        const PORT = process.env.PORT || 4000;
        // Create and start HTTP server
        const server = http.createServer(app);
        server.listen(PORT, () =>
            console.log(`🚀 Server running on port ${PORT}`)
        );

        // Error handling
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err);
            process.exit(1);
        });

        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Promise Rejection:', err);
        });
    })
    .catch((err) => {
        console.error('Failed to start server due to DB error:', err);
    });
