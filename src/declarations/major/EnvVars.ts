/* eslint-disable node/no-process-env */

import * as process from 'process';

export default {
  nodeEnv: process.env.NODE_ENV ?? '',
  port: process.env.PORT ?? 0,
  path: process.env.HOST ?? 'localhost',
  prefix: 'http://',
  cookieProps: {
    key: 'ExpressGeneratorTs',
    secret: process.env.COOKIE_SECRET ?? '',
    options: {
      httpOnly: true,
      signed: true,
      path: process.env.COOKIE_PATH ?? '',
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: process.env.COOKIE_DOMAIN ?? '',
      secure: process.env.SECURE_COOKIE === 'true',
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    exp: process.env.COOKIE_EXP ?? '', // exp at the same time as the cookie
  },
  oauth2: {
    clientAppId: process.env.CLIENT_APP_ID ?? '',
    clientAppSecret: process.env.CLIENT_APP_SECRET ?? '',
    redirectUri: process.env.REDIRECT_URI ?? '',
  },
} as const;
