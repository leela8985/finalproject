import express from 'express';
import cors from 'cors';
import path from 'path'; // <-- Add this line!
import authRoutes from './routes/auth.js';
import updatesRouter from './routes/updates.js';
import materialsRoutes from './routes/materials.js';

import bodyParser from 'body-parser';
import OpenAI from 'openai';

const openAiApiKey = process.env.OPEN_AI;

const app = express();

// Get allowed origin from environment variable or fallback to localhost


// Middleware
app.use(cors({
  origin:'http://localhost:3000' ,
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
    'HTTP-Referer': 'http://localhost:3000/',  // Replace as needed
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


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;