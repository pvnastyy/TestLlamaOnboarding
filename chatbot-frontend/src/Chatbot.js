import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css'; 

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input.trim()) return;
  
    // Add user message to the chat
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
  
    // Reset input field
    setInput("");
  
    try {
      // Send user message to the Flask backend
      const response = await axios.post("http://localhost:5000/chat", { message: input });
      const botMessage = { sender: "bot", text: response.data.reply };
  
      // Add bot's response to the chat
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with the backend:", error);
      const errorMessage = { sender: "bot", text: "Oops! Something went wrong." };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;