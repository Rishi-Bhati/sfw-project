import { useState, useEffect, useRef } from 'react';

// Main App Component
export default function App() {
  // State to hold all the chat messages.
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'ai',
    },
  ]);

  // State to hold the user's current input in the text box.
  const [inputValue, setInputValue] = useState('');

  // State to show a "typing..." indicator while the AI is "thinking".
  const [isLoading, setIsLoading] = useState(false);
  
  // A ref to the chat container div. We'll use this to auto-scroll to the latest message.
  const chatEndRef = useRef(null);

  // This effect runs whenever the 'messages' array changes.
  // It smoothly scrolls the chat window to the bottom.
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- MOCK AI RESPONSE FUNCTION ---
  // This is where we simulate the AI's reply. Later, we'll replace this with a real backend call.
  const getAIResponse = (userInput) => {
    const responses = {
      "hello": "Hi there! How can I assist you?",
      "how are you": "I'm just a bunch of code, but I'm doing great! Thanks for asking.",
      "what is your name": "I am a helpful AI assistant created to help you.",
      "help": "Sure, I can help. What do you need assistance with?",
      "time": `The current time is ${new Date().toLocaleTimeString()}.`,
      "bye": "Goodbye! Have a great day.",
    };
    
    const lowerCaseInput = userInput.toLowerCase();
    // Return a specific response if a keyword matches, otherwise return a default message.
    return responses[lowerCaseInput] || "Sorry, I don't understand that. Could you rephrase?";
  };

  // --- HANDLE USER SENDING A MESSAGE ---
  const handleSendMessage = () => {
    // Don't send empty messages
    if (inputValue.trim() === '') return;

    // Create a new message object for the user's input
    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    // Add the user's message to the chat
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Clear the input box and show the loading indicator
    setInputValue('');
    setIsLoading(true);

    // Simulate a delay for the AI's response
    setTimeout(() => {
      const aiResponseText = getAIResponse(inputValue);
      const aiMessage = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' };
      // Add the AI's message to the chat
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      // Hide the loading indicator
      setIsLoading(false);
    }, 1500); // 1.5-second delay
  };

  // Function to handle sending the message when the "Enter" key is pressed
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    // Main container for the entire app
    <div className="font-sans bg-gray-900 text-white flex flex-col h-screen">
      {/* Header Section */}
      <header className="bg-gray-800 shadow-md p-4 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-cyan-400">AI Chatbot</h1>
      </header>

      {/* Chat Messages Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Loop through all messages and display them */}
          {messages.map((message) => (
            <div key={message.id} className={`flex items-end gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* AI Icon */}
              {message.sender === 'ai' && (
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                 </div>
              )}
              {/* Message Bubble */}
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md ${message.sender === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                <p className="text-sm">{message.text}</p>
              </div>
               {/* User Icon */}
               {message.sender === 'user' && (
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                 </div>
              )}
            </div>
          ))}
          {/* Loading Indicator ("typing...") */}
          {isLoading && (
            <div className="flex items-end gap-3 justify-start">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </div>
              <div className="bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none shadow-md flex items-center space-x-2">
                <span className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce delay-200"></span>
                <span className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}
          {/* Empty div to which we scroll */}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Footer with Input Bar */}
      <footer className="bg-gray-800 p-4">
        <div className="flex items-center space-x-4 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            onKeyPress={handleKeyPress} 
            placeholder="Type your message..." 
            className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400" 
            disabled={isLoading} 
          />
          <button 
            onClick={handleSendMessage} 
            disabled={isLoading || inputValue.trim() === ''} 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full p-3 shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {/* Send Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      </footer>
    </div>
  );
}

