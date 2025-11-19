# 🤖 ZINC CHAT - Advanced AI Chatbot Platform

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.20.0-13AA52?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.14-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-ISC-yellow?style=flat-square)](LICENSE)

> A cutting-edge, full-stack AI chatbot application with real-time conversations, multiple LLM model support, and persistent chat history management.

---

## 🌟 Features

### 💬 Core Features
- **Multi-Model Support** - Seamlessly switch between multiple AI models (Gemma 3 4B, Gemma 3 1B, Mistral 7B, and more)
- **Real-Time Chat** - Instant message delivery with smooth animations and auto-scrolling
- **Persistent Chat History** - All conversations are saved to MongoDB for future reference
- **Smart Context Management** - AI maintains conversation context across multiple turns
- **Model Switching** - Change AI models mid-conversation with system notifications

### 🎨 User Interface
- **Modern Dark Theme** - Sleek zinc-colored UI with smooth transitions
- **Responsive Design** - Works flawlessly on desktop and mobile devices
- **Intuitive Sidebar** - Quick access to chat history with one-click loading
- **Hover-based Controls** - Delete chats with elegant delete button that appears on hover
- **Real-time Loading States** - Visual feedback with animated loading indicators

### 🔧 Advanced Features
- **Optimistic UI Updates** - Instant feedback before server confirmation
- **Error Recovery** - Automatic fallback and retry mechanisms
- **CORS-Enabled** - Secure cross-origin requests with proper headers
- **Chat Management** - Create, load, and delete chats with full CRUD operations
- **Timestamp Tracking** - Every message and chat is timestamped for audit trails

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (Local or Atlas cloud instance)
- **LM Studio** (For local AI model inference) - Download from [lmstudio.ai](https://lmstudio.ai)

### Installation

#### 1️⃣ Clone & Navigate
```bash
git clone <repository-url>
cd ai-chatbot
```

#### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file (optional):
```env
MONGO_URI=mongodb://127.0.0.1:27017/ai-chatbot
PORT=5000
```

#### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```

#### 4️⃣ Start LM Studio
- Open **LM Studio**
- Load your preferred model (e.g., Gemma 3 4B)
- Start the local server (typically runs on `http://localhost:1234`)

#### 5️⃣ Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
node index.js
```
Server runs on `http://127.0.0.1:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App opens at `http://localhost:5173`

---

## 📋 Project Structure

```
ai-chatbot/
├── 📁 backend/
│   ├── index.js                 # Express server entry point
│   ├── db.js                    # MongoDB connection config
│   ├── package.json             # Backend dependencies
│   └── 📁 routes/
│       └── chatRoutes.js        # All chat API endpoints
│   └── 📁 models/
│       └── Chat.js              # MongoDB Chat schema
│
├── 📁 frontend/
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   ├── App.css              # Component styles
│   │   ├── index.css            # Global styles
│   │   ├── main.jsx             # React entry point
│   │   └── 📁 assets/           # Static assets
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   ├── package.json             # Frontend dependencies
│   └── eslint.config.js         # ESLint rules
│
└── README.md                    # This file
```

---

## 🔌 API Documentation

### Base URL
```
http://127.0.0.1:5000/api/chats
```

### Endpoints

#### 📌 Get All Chats
```http
GET /api/chats
```
**Response:**
```json
[
  {
    "_id": "691dfac298ade48eb1c3675c",
    "title": "New Chat",
    "model": "gemma-3-4b-it",
    "messages": [...],
    "createdAt": "2025-11-19T17:13:38.006Z",
    "lastUpdated": "2025-11-19T17:13:47.267Z"
  }
]
```

#### 📌 Get Single Chat
```http
GET /api/chats/:id
```
**Response:**
```json
{
  "_id": "691dfac298ade48eb1c3675c",
  "title": "New Chat",
  "model": "gemma-3-4b-it",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?",
      "timestamp": "2025-11-19T17:13:41.877Z"
    },
    {
      "role": "assistant",
      "content": "I'm doing great, thanks for asking!",
      "timestamp": "2025-11-19T17:13:42.885Z"
    }
  ]
}
```

#### 📌 Create New Chat
```http
POST /api/chats
Content-Type: application/json

{
  "model": "gemma-3-4b-it"
}
```
**Response:** Returns new chat object with `_id`

#### 📌 Send Message
```http
POST /api/chats/:id/message
Content-Type: application/json

{
  "content": "Your message here",
  "model": "gemma-3-4b-it"
}
```
**Response:** Updated chat object with new messages

#### 📌 Delete Chat
```http
DELETE /api/chats/:id
```
**Response:**
```json
{
  "message": "Chat deleted successfully"
}
```

---

## 🏗️ Architecture Overview

### Frontend Flow
```
User Input
    ↓
React State Update (optimistic)
    ↓
API Request (POST/DELETE/GET)
    ↓
Server Response
    ↓
Update UI / Show Results
    ↓
Error Handling & Recovery
```

### Backend Flow
```
Express Route Handler
    ↓
MongoDB Query/Update
    ↓
LM Studio API Call (for AI responses)
    ↓
Process AI Response
    ↓
Save to Database
    ↓
JSON Response to Frontend
```

---

## 🎯 Key Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Framework | 19.1.1 |
| **Vite** | Build tool & Dev server | 7.1.7 |
| **Express.js** | Backend framework | 5.1.0 |
| **MongoDB** | Database | - |
| **Mongoose** | ODM for MongoDB | 8.20.0 |
| **Tailwind CSS** | Styling framework | 4.1.14 |
| **LM Studio** | Local LLM inference | - |
| **CORS** | Cross-origin requests | 2.8.5 |

---

## 🔐 Security Features

- ✅ CORS headers properly configured
- ✅ Input validation on backend
- ✅ Error messages don't leak sensitive info
- ✅ Optimistic UI prevents duplicate requests
- ✅ Event propagation stopped on delete buttons

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** Ensure MongoDB is running
```bash
# On Linux/Mac
mongod

# On Windows
net start MongoDB
```

### Issue: "LM Studio API Error"
**Solution:** 
1. Open LM Studio
2. Load a model (e.g., Gemma 3 4B)
3. Start the local server (should say "Server is running on http://localhost:1234")
4. Refresh the browser

### Issue: Delete button not working
**Solution:**
1. Check browser console (F12) for errors
2. Verify backend is running: `curl http://127.0.0.1:5000/api/chats`
3. Try deleting from the API directly:
```bash
curl -X DELETE http://127.0.0.1:5000/api/chats/{chatId}
```

### Issue: Port already in use
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

---

## 📦 Dependencies

### Backend
```json
{
  "cors": "^2.8.5",
  "express": "^5.1.0",
  "mongoose": "^8.20.0",
  "dotenv": "^17.2.3"
}
```

### Frontend
```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "tailwindcss": "^4.1.14"
}
```

---

## 📝 Scripts

### Backend
```bash
npm install        # Install dependencies
node index.js      # Start server
```

### Frontend
```bash
npm install         # Install dependencies
npm run dev         # Start dev server (http://localhost:5173)
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide)

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 🎉 Acknowledgments

- Built with ❤️ using React, Express, and MongoDB
- Powered by [LM Studio](https://lmstudio.ai) for local LLM inference
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Bundled with [Vite](https://vitejs.dev)

---

## 📧 Support & Feedback

Have questions or suggestions? Feel free to:
- Open an Issue on GitHub
- Check existing documentation
- Review the troubleshooting section above

---

<div align="center">

### Made with 💻 by Rishi

⭐ If this project helped you, please give it a star!

</div>
