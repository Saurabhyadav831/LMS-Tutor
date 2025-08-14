import {v2 as cloudinary} from "cloudinary";
import http from "http";
import connectDB from "./utils/db";

import { app, setupSocketIO } from "./app";
import logger from "./utils/logger";
require("dotenv").config();
const server = http.createServer(app);

// Setup Socket.IO
const io = setupSocketIO(server);

// cloudinary config
cloudinary.config({
 cloud_name: process.env.CLOUD_NAME,
 api_key: process.env.CLOUD_API_KEY,
 api_secret: process.env.CLOUD_SECRET_KEY,
});

// create server
server.listen(process.env.PORT, () => {
    logger.info('HTTP server listening', { port: process.env.PORT });
    logger.info('Socket.IO server listening', { port: process.env.PORT });
    connectDB();
});

// Process-level error logging
process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled Promise Rejection', { message: reason?.message, stack: reason?.stack, reason });
});

process.on('uncaughtException', (err: any) => {
    logger.error('Uncaught Exception', { message: err?.message, stack: err?.stack });
});