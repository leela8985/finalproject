import express from 'express';
import cors from 'cors';
import path from 'path'; // <-- Add this line!
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables from .env in development
dotenv.config();

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import authRoutes, { initAuth } from './routes/auth.js';
import updatesRouter from './routes/updates.js';
import materialsRoutes from './routes/materials.js';

import bodyParser from 'body-parser';
import OpenAI from 'openai';
import { connectToDB } from './Config/ConnectToDB.js';

const openAiApiKey = process.env.OPEN_AI;

const app = express();

// Get allowed origin(s) from environment variable `FRONTEND_ORIGIN`.
// Accepts a single origin or a comma-separated list of origins.
const frontendOriginEnv = process.env.FRONTEND_ORIGIN || '';
const allowedOrigins = frontendOriginEnv ? frontendOriginEnv.split(',').map(s => s.trim()).filter(Boolean) : [];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    // If no allowed origins configured, allow all but log a warning
    if (allowedOrigins.length === 0) {
      console.warn('Warning: FRONTEND_ORIGIN not set; allowing all origins (not recommended for production).');
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy: Origin not allowed: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies and credentials
}));

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount auth routes - connects all routes from auth.js
app.use('/auth', authRoutes);

// Mount updates routes - connects all routes from updates.js
app.use('/api/updates', updatesRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check root route (useful for Render / health probes)
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Mount materials routes
app.use('/api/materials', materialsRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});


const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: openAiApiKey,
  defaultHeaders: {
    'HTTP-Referer': (process.env.FRONTEND_ORIGIN || 'http://localhost:3000') + '/',  // Use frontend origin
    'X-Title': 'Your Site Name',                // Replace as needed
  },
});

app.post('/api/getResponse', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log("Received message from user:", message);

    // Call OpenAI via OpenRouter
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      max_tokens: 800, // Adjust this value to stay within your credits.
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    // Log the full OpenAI response
    console.log("Full OpenAI response:", completion);

    // Extract and log the bot's reply
    const botReply = completion.choices?.[0]?.message?.content || "No reply received";
    console.log("Bot reply:", botReply);

    // Send the bot's reply back to the client
    return res.json({ reply: botReply });
  } catch (error) {
    console.error("Error fetching bot response:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server after establishing DB connection
const startServer = async () => {
  try {
    await connectToDB();
    // Optionally initialize auth-related services like SMTP (non-blocking)
    initAuth().catch(err => console.warn('initAuth warning:', err && err.message));
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

export default app;