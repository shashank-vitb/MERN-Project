# MelodyMaster Music Player

A music player web application with React frontend and Node.js backend.

## Environment Configuration

This project uses a centralized configuration system for API endpoints, making it easy to deploy to different environments such as development, staging, and production.

### How to Configure Backend URL

The application uses a centralized API configuration located in `src/config/api.ts`. This file contains the configuration for different environments and automatically selects the appropriate one based on the current environment.

#### Local Development

For local development, the default backend URL is set to `http://localhost:5000`. No additional configuration is needed.

#### Production Deployment (Render + Vercel)

When deploying:

1. **Backend on Render**:
   - Deploy your backend to Render
   - Note the URL of your deployed API (e.g., `https://your-app-name.onrender.com`)

2. **Frontend on Vercel**:
   - Set the following environment variables in your Vercel project settings:
     - `VITE_API_URL`: Your Render backend API URL (e.g., `https://your-app-name.onrender.com/api`)
     - `VITE_UPLOADS_URL`: Your Render backend uploads URL (e.g., `https://your-app-name.onrender.com/uploads`)

The application will automatically use these environment variables when running in production mode.

### Modifying API Endpoints

If you need to add new API endpoints or modify existing ones:

1. Open `src/config/api.ts`
2. Add your new endpoint to the `endpoints` object
3. Use it in your components by importing from the config file:

```typescript
import { endpoints } from '../config/api';

// Use in API calls
const response = await axios.get(endpoints.yourNewEndpoint);
```

## Deployment Instructions

### Deploying Backend to Render

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Set the following options:
   - **Name**: Choose a unique name for your backend service
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` (or the appropriate start command for your backend)
   - **Add Environment Variables**: Add any required environment variables for your backend

### Deploying Frontend to Vercel

1. Create a new project in Vercel
2. Connect your GitHub repository
3. Set the following options:
   - **Framework Preset**: Vite
   - **Root Directory**: (leave as default if your frontend is at the root, otherwise specify)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add `VITE_API_URL` and `VITE_UPLOADS_URL` as described above

## Troubleshooting

- **CORS Issues**: If you encounter CORS issues, make sure your backend has CORS properly configured to allow requests from your Vercel frontend domain.
- **API Connection Issues**: Verify that the environment variables are correctly set on Vercel and that your Render backend is running.
- **404 Errors**: Check that the API endpoints in the config match the actual API routes on your backend.