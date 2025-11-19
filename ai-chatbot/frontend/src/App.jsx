import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemma-3-4b-it');

  const chatEndRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => { fetchChats(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // --- API CALLS ---

  const fetchChats = async () => {
    console.log("fetchChats called");
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/chats?t=${Date.now()}`);
      const data = await res.json();
      console.log("Fetched chats from server:", data.length);
      setChats(data);
    } catch (error) { console.error("Error fetching chats", error); }
  };

  const createNewChat = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selectedModel }) 
      });
      const newChat = await res.json();
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat._id);
      setMessages([]);
    } catch (error) { console.error("Error", error); }
  };

  const deleteChat = async (e, chatId) => {
    // Prevent event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("deleteChat called for chatId:", chatId);
    
    if (!confirm("Permanently delete this chat?")) {
      // If user cancels, restore the chat to the list
      console.log("User cancelled deletion");
      return;
    }

    console.log("User confirmed deletion. Starting delete process for:", chatId);

    // 1. Optimistic UI Remove
    setChats(prev => {
      console.log("Removing from UI:", chatId);
      const filtered = prev.filter(c => c._id !== chatId);
      console.log("Chats after filter:", filtered.length);
      return filtered;
    });
    
    if (activeChatId === chatId) {
      console.log("Current chat was active, clearing it");
      setActiveChatId(null);
      setMessages([]);
    }

    try {
      console.log("Sending DELETE request to server for chatId:", chatId);
      // 2. Network Request
      const res = await fetch(`http://127.0.0.1:5000/api/chats/${chatId}`, { 
        method: 'DELETE' 
      });
      
      console.log("Delete response status:", res.status);
      
      if (!res.ok) {
        console.error("Server failed to delete. Status:", res.status);
        // Sync if failed - restore the chat
        console.log("Refetching chats due to deletion failure");
        fetchChats();
      } else {
        const data = await res.json();
        console.log("Deleted successfully on server:", data);
      }
    } catch (error) { 
      console.error("Network error during deletion:", error);
      // Restore the chat if network fails
      console.log("Refetching chats due to network error");
      fetchChats(); 
    }
  };

  const loadChat = async (chatId) => {
    setActiveChatId(chatId);
    setIsLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/chats/${chatId}?t=${Date.now()}`);
      const chatData = await res.json();
      setMessages(chatData.messages);
      if (chatData.model) setSelectedModel(chatData.model);
    } catch (error) { console.error("Error", error); } finally { setIsLoading(false); }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    let currentId = activeChatId;
    
    if (!currentId) {
      const res = await fetch('http://127.0.0.1:5000/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selectedModel })
      });
      const newChat = await res.json();
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat._id);
      currentId = newChat._id;
    }

    const activeChat = chats.find(c => c._id === currentId);
    if (activeChat && activeChat.model !== selectedModel) {
        setMessages(prev => [...prev, { role: 'system', content: `Switched AI model to ${selectedModel}` }]);
    }

    const tempMsg = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, tempMsg]);
    
    const msgText = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/chats/${currentId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: msgText, model: selectedModel })
      });
      const updatedChat = await res.json();
      setMessages(updatedChat.messages);
      fetchChats(); 
    } catch (error) { console.error("Error", error); } finally { setIsLoading(false); }
  };

  const formatModelName = (modelId) => {
    if (!modelId) return 'Unknown';
    return modelId.split('-').slice(0, 2).join(' ').toUpperCase();
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-zinc-950 border-r border-zinc-900 flex flex-col">
        <div className="p-4 border-b border-zinc-900">
          <div className="flex items-center gap-2 mb-4 text-zinc-100 font-bold tracking-tight">
             <div className="w-5 h-5 bg-zinc-100 rounded-sm"></div>
             <span>ZINC<span className="text-zinc-600">CHAT</span></span>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Active Model</label>
            <div className="relative">
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-zinc-900 text-zinc-300 text-xs rounded-md border border-zinc-800 py-2 pl-3 pr-8 focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 outline-none appearance-none cursor-pointer transition-all hover:bg-zinc-800/50"
                >
                  {/* LM Studio Models */}
                  <option value="gemma-3-4b-it">Gemma 3 (4B)</option>
                  <option value="gemma-3-1b-it">Gemma 3 (1B)</option>
                  <option value="mistral-7b-instruct">Mistral 7B</option>
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none text-zinc-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
           {chats.length === 0 && (
             <div className="text-zinc-600 text-xs text-center py-4">No history</div>
           )}
           {chats.map((chat) => (
            // STRUCTURAL CHANGE: Using 'flex' to separate Text and Button physically
            <div 
              key={chat._id}
              className={`group flex items-center justify-between rounded-md text-sm transition-all border border-transparent pr-1 ${
                  activeChatId === chat._id 
                  ? 'bg-zinc-900 text-zinc-100 border-zinc-800 shadow-sm' 
                  : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'
              }`}
            >
              {/* 1. CLICKABLE TEXT AREA (Loads Chat) */}
              <div 
                onClick={() => loadChat(chat._id)}
                className="flex-1 truncate px-3 py-2 cursor-pointer select-none"
              >
                {chat.title || "Untitled Chat"}
              </div>
              
              {/* 2. SEPARATE DELETE BUTTON (Not inside the load div) */}
              <button 
                onClick={(e) => {
                  console.log("Delete button clicked for chat:", chat._id);
                  e.preventDefault();
                  e.stopPropagation();
                  deleteChat(e, chat._id);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 rounded-md transition-all flex-shrink-0 z-50 cursor-pointer pointer-events-auto"
                title="Delete Chat"
                type="button"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-900">
           <button 
             onClick={createNewChat}
             className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded shadow-sm transition-colors flex items-center justify-center gap-2"
           >
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
             NEW CHAT
           </button>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="flex-1 flex flex-col bg-zinc-950 relative">
        
        <header className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
               <span className="text-sm font-medium text-zinc-200">
                 {activeChatId ? 'Conversation' : 'Welcome'}
               </span>
               <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {formatModelName(selectedModel)}
               </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]"></div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
          {!activeChatId ? (
             <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                <div className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800">
                    <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <p className="text-sm">Select a model and start chatting.</p>
             </div>
          ) : (
             messages.map((msg, i) => (
               <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {msg.role === 'system' ? (
                      <div className="w-full flex justify-center my-4">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-600 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-900">
                              {msg.content}
                          </span>
                      </div>
                  ) : (
                      <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm border ${
                              msg.role === 'user' 
                              ? 'bg-zinc-100 text-zinc-900 border-zinc-100 rounded-br-sm' 
                              : 'bg-zinc-900 text-zinc-300 border-zinc-800 rounded-bl-sm'
                          }`}>
                              {msg.content}
                          </div>
                          {msg.role === 'assistant' && i === messages.length - 1 && (
                              <div className="mt-1 ml-1 text-[10px] text-zinc-600 font-mono">
                                  Generated by {formatModelName(selectedModel)}
                              </div>
                          )}
                      </div>
                  )}
               </div>
             ))
          )}
          
          {isLoading && (
             <div className="flex items-center gap-2 text-zinc-500 text-xs ml-2">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-150"></div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-zinc-950 border-t border-zinc-900/50">
           <div className="max-w-3xl mx-auto relative group">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Message ${formatModelName(selectedModel)}...`}
                className="w-full bg-zinc-900 text-zinc-200 text-sm rounded-xl pl-4 pr-12 py-3.5 border border-zinc-800 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/20 outline-none transition-all placeholder-zinc-600 shadow-inner"
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg disabled:opacity-0 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
           </div>
           <div className="text-center mt-2 text-[10px] text-zinc-700 font-mono">
              AI can make mistakes. Verify important info.
           </div>
        </div>

      </main>
    </div>
  );
}