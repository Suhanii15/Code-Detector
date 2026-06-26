require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const analyzeRoutes = require('./routes/analyze')

const app = express()


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

app.get("/", (_req, res) => {
  res.send("Code Detector Backend Running");
});

app.use("/api/analyze", analyzeRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});


app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
