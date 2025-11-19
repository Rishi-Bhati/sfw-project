const mongoose = require('mongoose');

// 1. Define the Message Schema
// This represents a SINGLE message bubble (either from you or the AI)
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant', 'system'] // Valid roles for LM Studio/OpenAI
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// 2. Define the Chat Session Schema
// This represents an entire conversation thread (like a sidebar item in ChatGPT)
const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'New Chat'
  },
  model: {
    type: String,
    default: 'local-model', // We'll update this when user selects a model
    required: true
  },
  // We store an array of messages here to keep the context together
  messages: [messageSchema], 
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// 3. Export the model so we can use it in our server
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;