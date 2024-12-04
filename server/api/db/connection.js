// function to mock a database connection
import mongoose from 'mongoose';

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_ADDRESS = process.env.DB_ADDRESS;
const DB_NAME = process.env.DB_NAME;

const connect = async () => {
    try {
        const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_ADDRESS}/?retryWrites=true&w=majority&appName=Cluster0`;
        await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
        console.log('Connected to Mongo');
    } catch (error) {
        console.error(`Error connecting to Mongo: ${error.message}`);
    }
};

export default { connect };
