import { isNotNil } from 'ramda';

const BACKEND_URL = isNotNil(process.env.API_ENDPOINT_BASE_URL)
    ? process.env.API_ENDPOINT_BASE_URL
    : process.env.REACT_APP_API_ENDPOINT_BASE_URL;

export const GRAPHQL_API_URL = `${BACKEND_URL}/graphql`;

export const TEXT_TO_SPEECH_KOREAN_URL = `${BACKEND_URL}/tts-korean`;

export const LOGIN_URL = `${BACKEND_URL}/auth/login`;

export const LOGOUT_URL = `${BACKEND_URL}/auth/logout`;

export const REFRESH_URL = `${BACKEND_URL}/auth/refresh`;
