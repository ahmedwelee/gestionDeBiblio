import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import axiosClient from '../axiosClient';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      liked: false,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const messagesEndRef = useRef(null);

  const handleLikeMessage = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, liked: !msg.liked } : msg
      )
    );
  };

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user's language preference
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const response = await axiosClient.get('/chat/context');
        const userLanguage = response.data.context.language || 'en';
        setLanguage(userLanguage);
        setIsRTL(userLanguage === 'ar');
      } catch (error) {
        console.log('Could not load language preference');
      }
    };
    loadLanguage();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await axiosClient.post('/chat/message', {
        message: inputValue,
      });

      const botMessage = {
        id: messages.length + 2,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
        liked: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        liked: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    try {
      await axiosClient.post('/chat/language', {
        language: newLanguage,
      });
      setLanguage(newLanguage);
      setIsRTL(newLanguage === 'ar');
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const getGreeting = () => {
    const greetings = {
      en: 'Library Support',
      ar: 'دعم المكتبة',
      fr: 'Support Bibliothèque',
    };
    return greetings[language] || 'Library Support';
  };

  const getPlaceholder = () => {
    const placeholders = {
      en: 'Type your message...',
      ar: 'اكتب رسالتك...',
      fr: 'Tapez votre message...',
    };
    return placeholders[language] || 'Type your message...';
  };

  const getSendButtonText = () => {
    const texts = {
      en: 'Send',
      ar: 'إرسال',
      fr: 'Envoyer',
    };
    return texts[language] || 'Send';
  };

  return (
    <div className="chatbot-container">
      {/* Floating Button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chatbot-window ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Header */}
          <div className="chatbot-header">
            <h3>{getGreeting()}</h3>
            <div className="chatbot-controls">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="language-selector"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {msg.sender === 'bot' && (
                  <button
                    className={`like-button ${msg.liked ? 'liked' : ''}`}
                    onClick={() => handleLikeMessage(msg.id)}
                    aria-label="Like this message"
                    title={msg.liked ? 'Unlike' : 'Like'}
                  >
                    {msg.liked ? '❤️' : '🤍'}
                  </button>
                )}
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="message bot-message">
                <p className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getPlaceholder()}
              disabled={loading}
              className="chatbot-input"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="send-button"
            >
              {getSendButtonText()}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;

