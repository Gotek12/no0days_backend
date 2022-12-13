import winston, { format } from 'winston';
import 'winston-mongodb/lib/winston-mongodb';

export const logger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    // format: winston.format.json(),
    format.printf((msg) => {
      return `${msg.timestamp} [${msg.level}] ${msg.message}`;
    }),
  ),
  transports: [
    new winston.transports.Console({ level: 'http' }),
    new winston.transports.MongoDB({
      level: 'error',
      db: 'mongodb://localhost:27017/no0days',
      options: { useUnifiedTopology: true },
      metaKey: 'meta',
    }),
  ],
});
