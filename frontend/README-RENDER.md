Frontend deployment for Render

This React app is a create-react-app project. To deploy on Render as a static site:

1. Build the app

   npm install
   npm run build

2. In Render, create a new Static Site and connect your repo. Set the build command to:

   npm install && npm run build

3. Set the publish directory to:

   build

4. Optional: If your backend is on a separate service, set environment variables in Render for API_BASE_URL or similar.

Notes:
- The project already includes a `build` script in `package.json`.
- Internal navigation uses `react-router-dom` and routes are configured in `src/App.js`.

If you want a server-based deployment instead (for SSR or custom routing), I can add a small Express server and a `start` script.