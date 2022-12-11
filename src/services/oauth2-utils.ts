import EnvVars from "@src/declarations/major/EnvVars";
import axios from "axios";

const AUTH_TOKEN_PATH = 'https://accounts.google.com/o/oauth2/v2/auth';
const ACCESS_TOKEN_PATH = 'https://oauth2.googleapis.com/token';
const PROFILE_DATA_PATH = 'https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token';
const SCOPES = ['profile', 'email', 'openid'];

const queryString = require ('querystring');
const queryParams = {
    client_id: process.env.CLIENT_APP_ID,
    redirect_uri: `${EnvVars.prefix.toString()}${EnvVars.path.toString()}:${EnvVars.port.toString()}${process.env.REDIRECT_URI}`, // must be 3000
};
const auth_token_params = {
    ...queryParams,
    response_type: 'code',
};
export const REQUEST_AUTH_CODE_URL
    = `${AUTH_TOKEN_PATH}?${queryString.stringify (auth_token_params)}&scope=${SCOPES.join (' ')}`;

export const getAccessToken = async (authCode: String) => {
    const access_token_params = {
        ...queryParams,
        client_secret: process.env.CLIENT_APP_SECRET,
        code: authCode,
        grant_type: 'authorization_code',
    };
    return axios.post(`${ACCESS_TOKEN_PATH}?${queryString.stringify(access_token_params)}`);
};

export const getProfileData = async (accessToken: String) => {
    return axios.post(`${PROFILE_DATA_PATH}=${accessToken}`);
};

export const getTokenData = async (accessToken: String) => {
    return axios.post(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
};