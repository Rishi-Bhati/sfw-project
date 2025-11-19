const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// 1. GET ALL CHATS
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ lastUpdated: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chats' });
  }
});

// 2. GET SINGLE CHAT
router.get('/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat' });
  }
});

// 3. CREATE NEW CHAT
router.post('/', async (req, res) => {
  try {
    const { model } = req.body;
    const newChat = new Chat({
      model: model || 'gemma-3-4b-it',
      messages: []
    });
    const savedChat = await newChat.save();
    res.json(savedChat);
  } catch (error) {
    res.status(500).json({ error: 'Error creating chat' });
  }
});

// 4. SEND MESSAGE (With Model Switching)
router.post('/:id/message', async (req, res) => {
  try {
    const { content, model } = req.body;
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    // Update model if provided
    if (model) chat.model = model;

    chat.messages.push({ role: 'user', content });

    // Prepare History
    const historyForAI = chat.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    const systemMessage = { role: "system", content: "You are a helpful, concise AI assistant." };

    try {
      console.log(`[Backend] Requesting LM Studio. Model: ${chat.model}`);
      
      const response = await fetch("http://localhost:1234/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: chat.model, 
          messages: [systemMessage, ...historyForAI],
          temperature: 0.7,
          stream: false
        })
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);
      if (!data.choices || data.choices.length === 0) throw new Error("Invalid response from AI");

      const aiResponseContent = data.choices[0].message.content;
      chat.messages.push({ role: 'assistant', content: aiResponseContent });

    } catch (aiError) {
      console.error("LM Studio Error:", aiError.message);
      chat.messages.push({ 
        role: 'assistant', 
        content: `Error: ${aiError.message}. Is the model loaded in LM Studio?` 
      });
    }

    chat.lastUpdated = Date.now();
    await chat.save();
    res.json(chat);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending message' });
  }
});

// 5. DELETE CHAT (Improved)
router.delete('/:id', async (req, res) => {
  const chatId = req.params.id;
  console.log(`[Backend] Attempting to delete chat: ${chatId}`);
  
  try {
    // Use deleteOne for a hard delete
    const result = await Chat.deleteOne({ _id: chatId });

    if (result.deletedCount === 0) {
      console.log(`[Backend] Chat ${chatId} not found or already deleted.`);
      return res.status(404).json({ error: 'Chat not found' });
    }

    console.log(`[Backend] Successfully deleted chat: ${chatId}`);
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error(`[Backend] Error deleting chat:`, error);
    res.status(500).json({ error: 'Error deleting chat' });
  }
});

module.exports = router;