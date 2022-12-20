import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';
import logger from 'jet-logger';
import EnvVars from '@src/declarations/major/EnvVars';
import HttpStatusCodes from '@src/declarations/major/HttpStatusCodes';
import { NodeEnvs } from '@src/declarations/enums';
import { RouteError } from '@src/declarations/classes';
import connect from '@src/db-connect';
import { userRoute } from '@src/controllers/user-controller';
import { oauth2Route } from '@src/controllers/oauth2-controller';
import { logger as log } from '@src/logger';
const cors = require('cors');

// Connect to mongoDB //
connect();

// **** Init express **** //

const app = express();

// **** Set basic express settings **** //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.cookieProps.secret));

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => log.http(message.trim()),
  },
});
app.use(morganMiddleware);

app.use(cors());

// Security
if (EnvVars.nodeEnv === NodeEnvs.Production) {
  app.use(helmet());
}

// **** Add API routes **** //

// Setup error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    logger.err(err, true);
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  },
);

app.get('/', (req: Request, res: Response) => {
  if (req.query.token) {
    res.json({ jwt: req.query.token });
  } else {
    res.json({ message: 'Hello in no0days app' });
  }
});

app.use('/', oauth2Route);
app.use('/users', userRoute);

// **** Export default **** //
export default app;
