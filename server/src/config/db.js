import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizApp';

let dbInstance = null;

export const initDB = async () => {
    if (dbInstance) {
        console.log('Using existing database connection.');
        return dbInstance;
    }
    try {
        const instance = await mongoose.connect(MONGO_URI);

        dbInstance = instance.connection;
        console.log('MongoDB database connected successfully!');
        return dbInstance;
    } catch (error) {
        console.error('MongoDB connection error: ', error);
        process.exit(1);
    }
};

export const getDB = () => {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call initDB() first.');
    }
    return dbInstance;
};

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnecdted. Reconnecting ...');
    initDB();
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB encountered an error: ', err);
});
