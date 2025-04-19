/**
 * Central configuration for API endpoints
 * This allows for easy switching between different environments
 * and simplifies deployment to various platforms like Render and Vercel
 */

// Environment configurations
interface EnvironmentConfig {
  apiUrl: string;
  uploadsUrl: string;
}

type EnvironmentMap = {
  [key: string]: EnvironmentConfig;
};

/**
 * Safe access to environment variables 
 * Will work with both Vite/React environment variables and regular process.env
 */
const getEnvVar = (name: string, defaultValue: string = ''): string => {
  // Try to access via import.meta.env first (for Vite/React)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
    return import.meta.env[name];
  }
  
  // Fallback to window.__env for runtime config if available
  if (typeof window !== 'undefined' && window.__env && window.__env[name]) {
    return window.__env[name];
  }
  
  // Finally try process.env for SSR/Node.js
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name];
  }
  
  // Return default if nothing found
  return defaultValue;
};

// Get the current environment mode
const getEnvironmentMode = (): string => {
  return getEnvVar('NODE_ENV', getEnvVar('MODE', 'development'));
};

// Configuration for different environments
const environments: EnvironmentMap = {
  development: {
    apiUrl: 'http://localhost:5000/api',
    uploadsUrl: 'http://localhost:5000/uploads',
  },
  production: {
    // For production deployment with backend on Render and frontend on Vercel
    apiUrl: getEnvVar('VITE_API_URL', 'https://your-backend-api.render.com/api'),
    uploadsUrl: getEnvVar('VITE_UPLOADS_URL', 'https://your-backend-api.render.com/uploads'),
  },
  // You can add more environments here (staging, testing, etc.)
};

// Get the config for the current environment
const getCurrentConfig = (): EnvironmentConfig => {
  const env = getEnvironmentMode();
  
  // Check if we have a configuration for this environment
  if (environments[env]) {
    return environments[env];
  }
  
  // If not found, use individual environment variables or development as fallback
  return {
    apiUrl: getEnvVar('VITE_API_URL', environments.development.apiUrl),
    uploadsUrl: getEnvVar('VITE_UPLOADS_URL', environments.development.uploadsUrl),
  };
};

// Export the configuration
const config = getCurrentConfig();

export default config;

// Add this type declaration to avoid TypeScript errors
declare global {
  interface Window {
    __env?: Record<string, string>;
  }
}

// Helper functions for common API endpoints
export const endpoints = {
  // Auth endpoints
  login: `${config.apiUrl}/auth/login`,
  register: `${config.apiUrl}/auth/register`,
  
  // Songs endpoints
  songs: `${config.apiUrl}/songs`,
  song: (id: string) => `${config.apiUrl}/songs/${id}`,
  
  // Playlists endpoints
  playlists: `${config.apiUrl}/playlists`,
  playlist: (id: string) => `${config.apiUrl}/playlists/${id}`,
  playlistSongs: (id: string) => `${config.apiUrl}/playlists/${id}/songs`,
  playlistSong: (playlistId: string, songId: string) => `${config.apiUrl}/playlists/${playlistId}/songs/${songId}`,
  
  // Helper for uploads
  songFile: (filePath: string) => `${config.uploadsUrl}/${filePath}`,
};