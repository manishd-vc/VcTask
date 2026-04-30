import axios from 'axios';
import { deleteCookies } from 'src/hooks/cookies';
const https = require('https');

/**
 * Retrieves the token value from document cookies.
 * @param {string} tokenName - The name of the token to retrieve.
 * @returns {string} The value of the token if found, otherwise an empty string.
 */
function getToken(tokenName) {
  if (typeof window !== 'undefined') {
    let name = tokenName + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (const c of ca) {
      let trimmed = c.trim();
      if (trimmed.startsWith(name)) {
        return trimmed.substring(name.length);
      }
    }
    return '';
  }
  return '';
}

/**
 * Creates an HTTPS agent that disables unauthorized certificate rejection.
 */
const agent = new https.Agent({
  rejectUnauthorized: false
});

const baseURL = process.env.BASE_URL;

/**
 * Creates an Axios instance configured with base URL, timeout, and HTTPS agent.
 */
const http = axios.create({
  baseURL: baseURL + `/api`,
  httpsAgent: agent,
  timeout: 30000
});

/**
 * Request interceptor to add Authorization header with user token.
 * @param {Object} config - Axios request configuration object.
 * @returns {Object} The updated request configuration.
 */
http.interceptors.request.use(
  (config) => {
    const token = getToken('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle token refresh on 401 errors.
 * @param {Object} response - Axios response object.
 * @returns {Object} The response or a rejected promise if an error occurs.
 */
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      try {
        const refreshToken = getToken('refreshToken');
        const { data, status } = await axios.post(`${baseURL}/api/user/refresh-token`, refreshToken, {
          headers: {
            'Content-Type': 'text/plain'
          }
        });
        if (status === 200) {
          await createCookies('adminToken', data?.data);
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return api(originalRequest); // retry the original request with new access token
        }
      } catch (refreshError) {
        console.log('Refresh token failed:', refreshError);
        deleteCookies('userToken');
        deleteCookies('refreshToken');
        localStorage.removeItem('redux-user');
        localStorage.removeItem('redux-settings');
        await deleteCookies('adminToken');
        await deleteCookies('refreshToken');
        await deleteCookies('assignRoles');
        try {
          await axios.post(`${baseURL}/api/user/sign-out`);
        } catch (logoutErro) {
          console.log('Refresh token failed:', logoutErro);
        }
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
        console.log('Refresh token failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default http;
