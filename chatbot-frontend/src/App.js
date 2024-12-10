import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/chat", { message: input });
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error occurred!" }]);
    }
  };

  const handleUploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/photo-chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { extracted_text, reply } = response.data;

      setMessages((prev) => [
        ...prev,
        { sender: "user", text: extracted_text },
        { sender: "bot", text: reply },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error with photo upload!" }]);
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
        <div className="photo-upload">
          <label htmlFor="file-upload" className="custom-file-upload">
            Upload Photo
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => handleUploadPhoto(e.target.files[0])}
          />
        </div>
      </div>
    </div>
  );
}

export default App;