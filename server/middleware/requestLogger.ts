import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTimeMs = Date.now();

  const { method, originalUrl } = req;
  const requestId = (Math.random() + 1).toString(36).substring(2);

  logger.info("Incoming request", {
    requestId,
    method,
    url: originalUrl,
    ip: req.ip,
    query: req.query,
    body: req.body,
    userAgent: req.get("user-agent"),
  });

  res.on("finish", () => {
    const durationMs = Date.now() - startTimeMs;
    logger.info("Request completed", {
      requestId,
      method,
      url: originalUrl,
      statusCode: res.statusCode,
      durationMs,
      contentLength: res.get("content-length"),
    });
  });

  next();
};

export default requestLogger;


