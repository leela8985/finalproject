Frontend deployment for Render

This React app is a create-react-app project. To deploy on Render as a static site:

1. Build the app

   npm install
   npm run build

2. In Render, create a new Static Site and connect your repo. Set the build command to:

   npm install && npm run build

3. Set the publish directory to:

   build

4. Environment variable: this frontend reads the backend URL from `REACT_APP_API_URL`.
   - In Render's site settings, add an environment variable named `REACT_APP_API_URL` with your backend URL (for example `https://your-backend.example.com`).
   - If `REACT_APP_API_URL` is not set, the app falls back to `http://localhost:5000` (useful for local development).

Notes:
- The project already includes a `build` script in `package.json`.
- Internal navigation uses `react-router-dom` and routes are configured in `src/App.js`.

If you want a server-based deployment instead (for SSR or custom routing), I can add a small Express server and a `start` script.