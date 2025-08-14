import axios from 'axios';

// Get the base URL from our environment variable
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create a new instance of axios with a custom configuration
const api = axios.create({
  // Set the base URL for all requests made with this instance
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For example, to fetch the curriculum:
// Instead of: fetch('/api/math/curriculum')
// We will now use: api.get('/math/curriculum')

export default api;