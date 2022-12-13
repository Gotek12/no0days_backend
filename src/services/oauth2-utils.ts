import { stringify } from 'querystring-ts';
import EnvVars from '@src/declarations/major/EnvVars';
import axios from 'axios';

const AUTH_TOKEN_PATH = 'https://accounts.google.com/o/oauth2/v2/auth';
const ACCESS_TOKEN_PATH = 'https://oauth2.googleapis.com/token';
const PROFILE_DATA_PATH = 'https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token';
const SCOPES = ['profile', 'email', 'openid'];

const queryParams = {
  client_id: EnvVars.oauth2.clientAppId.toString(),
  redirect_uri: `${EnvVars.prefix.toString()}${EnvVars.path.toString()}:${EnvVars.port.toString()}${EnvVars.oauth2.redirectUri.toString()}`, // must be 3000
};
const auth_token_params = {
  ...queryParams,
  response_type: 'code',
};
export const REQUEST_AUTH_CODE_URL = `${AUTH_TOKEN_PATH}?${stringify(auth_token_params)}&scope=${SCOPES.join(' ')}`;

export const getAccessToken = async (authCode: string): Promise<any> => {
  const access_token_params = {
    ...queryParams,
    client_secret: EnvVars.oauth2.clientAppSecret.toString(),
    code: authCode,
    grant_type: 'authorization_code',
  };
  return axios.post(`${ACCESS_TOKEN_PATH}?${stringify(access_token_params)}`);
};

export const getProfileData = async (accessToken: string): Promise<any> => {
  return axios.post(`${PROFILE_DATA_PATH}=${accessToken}`);
};
