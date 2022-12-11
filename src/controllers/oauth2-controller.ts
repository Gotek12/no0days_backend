import express, {Request, Response} from "express";
import { getAccessToken, getProfileData, REQUEST_AUTH_CODE_URL } from '../services/oauth2-utils';
import UserModel from "@src/models/userModel";
import {Provider} from "@src/models/provider";
import {findUserByEmail} from "@src/services/user-service";

const REDIRECT_URI = String(process.env.REDIRECT_URI);
export const oauth2Route = express.Router();

oauth2Route.get('/auth/init', async (req: Request, res: Response) => {
    try {
        res.redirect (REQUEST_AUTH_CODE_URL);
    } catch (error) {
        res.sendStatus (500);
        console.error(error.message);
    }
});

oauth2Route.get(REDIRECT_URI, async (req: Request, res: Response) => {
    const authorizationToken = String(req.query.code); // auth token
    try {
        const response = await getAccessToken(authorizationToken);

        const { access_token } = response.data;
        const jwtAsIdToken = response.data.id_token;

        const user = await getProfileData (access_token);
        const { name, email } = user.data;

        findUserByEmail(email)
                .then(() => {
                    console.log("user exist");
                })
                .catch(() => {
                    UserModel.create({
                        name,
                        email,
                        provider: Provider.GOOGLE,
                        active: true,
                        last_log_in: new Date()
                    });
                    console.log("Create new user");
                    // getUser and if exist save
                });
        res.redirect (`/?token=${jwtAsIdToken}`);
    } catch (error) {
        console.error(error.message);
        res.sendStatus (500);
    }
});


// tut from
// https://www.telerik.com/blogs/implementing-oauth-2-using-node-js
// sudo lsof -i :3000
// kill -9