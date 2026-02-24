import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Shorten a URL
 */
export const shortenURL = async (longUrl, expiresIn = null) => {
  try {
    const payload = { long_url: longUrl };
    if (expiresIn) {
      payload.expires_in = expiresIn;
    }
    
    const response = await api.post('/shorten', payload);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to shorten URL' 
    };
  }
};

/**
 * Get URL statistics
 */
export const getURLStats = async (shortCode) => {
  try {
    const response = await api.get(`/stats/${shortCode}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch stats' 
    };
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Backend is offline' };
  }
};

/**
 * Get click analytics
 */
export const getClickAnalytics = async (shortCode) => {
  try {
    const response = await api.get(`/analytics/${shortCode}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch analytics' 
    };
  }
};

export default api;