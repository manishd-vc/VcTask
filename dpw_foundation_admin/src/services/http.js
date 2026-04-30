import axios from 'axios';
import { createCookies, deleteCookies } from 'src/hooks/cookies';
const https = require('https');

/**
 * Retrieves a token from the cookies.
 * @param {string} tokenName - The name of the token to retrieve (e.g., 'adminToken').
 * @returns {string} - The token value, or an empty string if not found.
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

// Create a custom HTTPS agent to allow self-signed certificates (insecure)
const agent = new https.Agent({
  rejectUnauthorized: false
});

// Base URL for API requests
const baseURL = process.env.BASE_URL;
// Create an axios instance with custom settings
const http = axios.create({
  baseURL: baseURL + `/api`,
  httpsAgent: agent,
  timeout: 30000 // 30-second timeout for requests
});

// Request interceptor to add the Authorization header with the admin token
http.interceptors.request.use(
  (config) => {
    const token = getToken('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 (Unauthorized) errors and refresh the token
http.interceptors.response.use(
  (response) => response, // If the response is successful, return it
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      try {
        const refreshToken = getToken('refreshAdminToken');
        // Send a request to refresh the token
        const { data } = await axios.post(`${baseURL}/api/user/refresh-token`, refreshToken, {
          headers: {
            'Content-Type': 'text/plain'
          }
        });
        // Save the new token in cookies
        await createCookies('adminToken', data?.data);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        await deleteCookies('adminToken');
        await deleteCookies('refreshAdminToken');
        await deleteCookies('assignRoles');
        try {
          await axios.post(`${baseURL}/api/user/sign-out`);
        } catch (logoutErro) {
          console.log('Refresh token failed:', logoutErro);
        }
        if (window.location.pathname !== '/dpwfadm/auth/login') {
          window.location.href = '/dpwfadm/auth/login';
        }
        console.log('Refresh token failed:', refreshError);
        return Promise.reject(refreshError); // If the refresh fails, reject the promise
      }
    }

    // If the error is not 401, reject the promise with the original error
    return Promise.reject(error);
  }
);

export default http;
