/**
 * Runtime environment configuration for the application
 * This file allows changing environment variables after the app is built
 * 
 * To use in production:
 * 1. Deploy the frontend to Vercel
 * 2. Edit this file on the deployed app to set your actual backend URL
 * 
 * Example:
 * window.__env = {
 *   VITE_API_URL: 'https://your-actual-api.render.com/api',
 *   VITE_UPLOADS_URL: 'https://your-actual-api.render.com/uploads',
 * };
 */

// Default configuration - you can modify this file in production
window.__env = window.__env || {};

// These defaults will be overridden by build-time environment variables
// or can be manually changed in production without rebuilding the app
window.__env.VITE_API_URL = window.__env.VITE_API_URL || '';
window.__env.VITE_UPLOADS_URL = window.__env.VITE_UPLOADS_URL || '';