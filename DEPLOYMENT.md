# Deployment Guide

This guide explains how to deploy the MelodyMaster application with the backend on Render and the frontend on Vercel.

## Backend Deployment (Render)

1. **Create a Render account** if you don't have one at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your backend code

3. **Configure the Web Service**:
   - **Name**: Choose a name for your backend (e.g., `melodymaster-api`)
   - **Environment**: Node
   - **Region**: Choose the region closest to your users
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: Specify the directory containing your backend code, if not at the root (e.g., `/backend`)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` (or your actual start command)

4. **Add Environment Variables**:
   - Add any required environment variables for your backend (database connection, JWT secrets, etc.)
   - Click "Advanced" and add environment variables

5. **Create Web Service**:
   - Click "Create Web Service"
   - Render will deploy your backend - note the URL (e.g., `https://melodymaster-api.onrender.com`)

## Frontend Deployment (Vercel)

1. **Create a Vercel account** if you don't have one at [vercel.com](https://vercel.com)

2. **Import your project**:
   - Click "Add New..." → "Project"
   - Connect your GitHub repository
   - Select the repository containing your frontend code

3. **Configure the project**:
   - **Framework Preset**: Select "Vite"
   - **Root Directory**: Specify the directory containing your frontend code, if not at the root (e.g., `/`)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)

4. **Add Environment Variables**:
   - Add the following environment variables with your Render backend URL:
     - `VITE_API_URL`: `https://your-backend-name.onrender.com/api`
     - `VITE_UPLOADS_URL`: `https://your-backend-name.onrender.com/uploads`

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend

## Verify the Deployment

1. Visit your Vercel frontend URL
2. Ensure you can:
   - Register and login
   - Upload songs
   - Create playlists
   - Play music
   
If you encounter any issues, check the following:

1. **CORS Issues**: Ensure your backend has CORS configured to allow requests from your Vercel frontend domain
2. **API Connection**: Verify that the environment variables are correctly set
3. **Backend Status**: Check that your Render backend is running correctly

## Runtime Configuration (Optional)

After deployment, if you need to change the backend URL without redeploying the frontend:

1. Find the `env-config.js` in your deployed frontend
2. Update the values:
```js
window.__env = {
  VITE_API_URL: 'https://your-new-backend-url.render.com/api',
  VITE_UPLOADS_URL: 'https://your-new-backend-url.render.com/uploads',
};
```

This allows you to point your frontend to a different backend without redeploying.