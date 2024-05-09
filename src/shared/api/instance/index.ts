import axios from 'axios';

const INSTANCE_TIMEOUT = 3000;
const INSTANCE_HEADER = { 'Content-Type': 'application/json' };

export const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL + '/v1',
  headers: INSTANCE_HEADER,
  timeout: INSTANCE_TIMEOUT,
});
