import mongoose from 'mongoose';
require('dotenv').config();
import logger from './logger';

const dbUrl:string = process.env.DB_URL || '';

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl).then((data:any) => {
            logger.info('Database connected', { host: data.connection.host });
        })
    } catch (error:any) {
        logger.error('Database connection error', { message: error.message, stack: error.stack });
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;