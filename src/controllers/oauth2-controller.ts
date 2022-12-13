import express, { Request, Response } from 'express';
import { getAccessToken, getProfileData, REQUEST_AUTH_CODE_URL } from '../services/oauth2-utils';
import { Provider } from '@src/models/provider';
import { addNewUserByOauth, findUserByEmail } from '@src/services/user-service';
import EnvVars from '@src/declarations/major/EnvVars';

const REDIRECT_URI = EnvVars.oauth2.redirectUri.toString();
export const oauth2Route = express.Router();

oauth2Route.get('/auth/init', async (req: Request, res: Response) => {
  try {
    res.redirect(REQUEST_AUTH_CODE_URL);
  } catch (error) {
    res.sendStatus(500);
    console.error(error.message);
  }
});

oauth2Route.get(REDIRECT_URI, async (req: Request, res: Response) => {
  const authorizationToken = String(req.query.code); // auth token
  try {
    const response = await getAccessToken(authorizationToken);

    const { access_token } = response.data;
    const jwtAsIdToken = response.data.id_token;

    const user = await getProfileData(access_token);
    const { name, email } = user.data;

    findUserByEmail(email).then((user) => {
      if (user) {
        console.log('user exist');
        // update last_log_in
        return;
      }

      addNewUserByOauth(name, email)
        .then(() => {
          console.log(`User ${email} was created using ${Provider.GOOGLE.toString()}`);
        })
        .catch(() => {
          console.error(`User ${email} was not created using ${Provider.GOOGLE.toString()}`);
          res.sendStatus(500);
        });
    });
    res.redirect(`/?token=${jwtAsIdToken}`);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
});

// tut from
// https://www.telerik.com/blogs/implementing-oauth-2-using-node-js
// sudo lsof -i :3000
// kill -9
