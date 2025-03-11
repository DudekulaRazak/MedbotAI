import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I’m MedBot 🩺. How can I help you today?", type: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, type: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input
      });

      const botReply = response.data.reply;
      setMessages((prev) => [...prev, { text: botReply, type: "bot" }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong. Please try again.", type: "bot" }
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>🩺 MedBot AI</h1>
        <p>Your friendly medical query assistant</p>
      </header>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.type === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">Typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="input-box">
        <input
          type="text"
          value={input}
          placeholder="Ask me something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
