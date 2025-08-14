type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMeta {
  [key: string]: unknown;
}

const formatMessage = (level: LogLevel, message: string, meta?: LogMeta) => {
  const logObject: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (meta && Object.keys(meta).length > 0) {
    logObject.meta = meta;
  }

  return JSON.stringify(logObject);
};

export const logger = {
  debug: (message: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.debug(formatMessage("debug", message, meta));
  },
  info: (message: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.log(formatMessage("info", message, meta));
  },
  warn: (message: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.warn(formatMessage("warn", message, meta));
  },
  error: (message: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.error(formatMessage("error", message, meta));
  },
};

export default logger;


