const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Groq } = require('groq-sdk');

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Models
const User = require('./models/User');
const Post = require('./models/Post');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check for Render
app.get('/', (req, res) => {
  res.send('Sanchaay API is running fine! 🌱🚀');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// AI Clients
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const bcrypt = require('bcryptjs');

// 1. Auth / Login (with Smile detection & Passwords)
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  if (!password) return res.status(400).json({ error: 'Password required' });

  try {
    let user = await User.findOne({ username });
    
    if (!user) {
      // REGISTER: Create new user with hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ username, password: hashedPassword });
      console.log(`👤 [REGISTER] New user created: ${username}`);
    } else {
      // LOGIN: Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
      console.log(`🔑 [LOGIN] User authenticated: ${username}`);
    }

    const now = new Date();
    const lastLogin = new Date(user.lastLogin);
    const diffTime = Math.abs(now - lastLogin);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.streak += 1;
    } else if (diffDays > 1) {
      user.streak = 1; 
    } else if (user.streak === 0) {
      user.streak = 1; 
    }

    user.lastLogin = now;
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error('❌ Auth Error:', err);
    res.status(500).json({ error: 'Auth failed', details: err.message });
  }
});

// 2. Community Feed (DB Persistent)
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 }).limit(20);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Fetch posts failed' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      likes: [],
      comments: [],
      timestamp: new Date(),
      color: ['bg-green-100', 'bg-blue-100', 'bg-yellow-100', 'bg-pink-100'][Math.floor(Math.random() * 4)]
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Post creation failed' });
  }
});

app.post('/api/posts/:id/like', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const index = post.likes.indexOf(username);
    if (index === -1) post.likes.push(username);
    else post.likes.splice(index, 1);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Like failed' });
  }
});

app.post('/api/posts/:id/comment', async (req, res) => {
  const { username, text } = req.body;
  if (!username || !text) return res.status(400).json({ error: 'Username and text required' });
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments.push({ user: username, text, timestamp: new Date() });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Comment failed' });
  }
});

// 3. User Stats Update
app.post('/api/user/sync', async (req, res) => {
  const { username, stats } = req.body;
  console.log(`📡 [SYNC] User: ${username}`);
  console.log(`📊 [STATS RECEIVED]:`, JSON.stringify(stats, null, 2));

  try {
    const user = await User.findOneAndUpdate(
      { username }, 
      { $set: stats }, 
      { new: true, returnDocument: 'after', upsert: true }
    );
    console.log(`✅ [SYNC SUCCESS] DB state for ${username}:`, JSON.stringify({
        missions: user.completedMissions,
        custom: user.customMissions?.length || 0
    }, null, 2));
    res.json(user);
  } catch (err) {
    console.error('❌ Sync failed:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find().sort({ xp: -1 }).limit(5);
    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ error: 'Leaderboard fetch failed' });
  }
});

// 4. CO2 Prediction (Scientific Accuracy with Gemini Fallback)
app.post('/api/predict-co2', async (req, res) => {
  const { activity } = req.body;
  const prompt = `You are a sustainability expert. Given a specific activity, predict the CO2 saved in kg. Respond ONLY with a JSON object: {"kg": number, "explanation": "string"}. Be scientific. Activity: "${activity}"`;
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a sustainability expert. Respond ONLY with a valid JSON object.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });
    console.log('🤖 [AI] Predicted using Groq');
    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (groqErr) {
    console.warn('⚠️ [AI] Groq failed, switching to Gemini...');
    try {
      // Fallback: Gemini
      const result = await geminiModel.generateContent(prompt + " Ensure the output is JUST JSON object without markdown wrappers.");
      const response = await result.response;
      const text = response.text().replace(/```json|```/g, "").trim();
      console.log('🌟 [AI] Predicted using Gemini Fallback');
      res.json(JSON.parse(text));
    } catch (geminiErr) {
      console.error('❌ [AI] All AI services failed');
      res.status(500).json({ error: 'AI Error' });
    }
  }
});

// 5. Chat Assistant Proxy (with Gemini Fallback)
app.post('/api/chat', async (req, res) => {
  const { messages, userStats } = req.body;
  const systemPrompt = `You are a Sustainability AI for Sanchaay. User Level: ${userStats?.level || 1}. Be witty and scientific. Keeping it concise.`;
  
  try {
    // Primary: Groq
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      model: 'llama-3.3-70b-versatile',
    });
    console.log('🤖 [CHAT] Responded using Groq');
    res.json({ content: completion.choices[0].message.content });
  } catch (groqErr) {
    console.warn('⚠️ [CHAT] Groq failed, switching to Gemini...');
    try {
      // Fallback: Gemini
      const chatHistory = messages.slice(0, -1)
        .filter(m => m.role === 'user' || m.role === 'assistant' || m.role === 'model')
        .map(m => ({
          role: (m.role === 'user') ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

      // Ensure history starts with user for Gemini
      if (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
        chatHistory.shift();
      }

      const chat = geminiModel.startChat({
        history: chatHistory,
        generationConfig: { maxOutputTokens: 500 }
      });
      const lastMsg = messages[messages.length - 1].content;
      const result = await chat.sendMessage(systemPrompt + "\n\nUser Question: " + lastMsg);
      console.log('🌟 [CHAT] Responded using Gemini Fallback');
      res.json({ content: result.response.text() });
    } catch (geminiErr) {
      console.error('❌ [CHAT] All services failed');
      res.status(500).json({ error: 'Chat failed' });
    }
  }
});

app.listen(port, () => {
  console.log(`🚀 Production-grade server running on port ${port}`);
});
