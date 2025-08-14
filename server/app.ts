require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import requestLogger from "./middleware/requestLogger";
import logger from "./utils/logger";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:19006", // Expo development server
  "http://localhost:8081",  // Metro bundler
  "exp://localhost:19000",  // Expo Go
  "exp://192.168.*.*:19000" // Expo Go on local network
];
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed origins
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.match(new RegExp(allowedOrigin.replace('*', '.*')))
    )) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "access-token",
    "refresh-token",
    "Authorization",
  ],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// request/response logging
app.use(requestLogger);


// routes
app.use(
  "/api/v1",
  userRouter,
  orderRouter,
  courseRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// middleware calls
app.use(ErrorMiddleware);

// Export Socket.IO setup function
export const setupSocketIO = (server: any) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    logger.info("Socket connected", { socketId: socket.id });

    socket.on("disconnect", () => {
      logger.info("Socket disconnected", { socketId: socket.id });
    });

    // Add your Socket.IO event handlers here
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      logger.info("Socket joined room", { socketId: socket.id, roomId });
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      logger.info("Socket left room", { socketId: socket.id, roomId });
    });
  });

  return io;
};
