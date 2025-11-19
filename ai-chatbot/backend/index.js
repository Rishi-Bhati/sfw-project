const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

// 1. Import the routes (Make sure this path matches your folder structure!)
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = 5000;

// 2. Connect to Database
connectToMongo();

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Debugging Middleware (Logs every request to the console)
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// 5. REGISTER ROUTES
// This is the line that was likely missing or failing
app.use('/api/chats', chatRoutes);

// 6. Start Server
app.listen(PORT, () => {
  console.log(`✅ Backend server listening on port ${PORT}`);
  console.log(`   Test URL: http://localhost:5000/api/chats`);
});