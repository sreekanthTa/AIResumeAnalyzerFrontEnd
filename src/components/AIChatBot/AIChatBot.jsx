import React, { useState } from 'react';
import axios from 'axios';
import styles from './AIChatBot.module.css';

const AIChatBot = ({ 
  chatMessages,
  isChatLoading, 
  isExpanded,
  setIsExpanded,
  userQuestion,
  handleInputValue,
  placeholder = "Ask me anything...",
  position = "right", // or "bottom"
  handleChatSubmit
 }) => {

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

   console.log("chatMessages", chatMessages);
  return (
    <div className={`${styles.chatContainer} ${styles[position]} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.chatHeader} onClick={() => setIsExpanded(!isExpanded)}>
        <h3>AI Assistant</h3>
        <button className={styles.expandButton}>
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className={styles.messagesContainer}>
            {chatMessages.map((message, index) => (
              <div key={index} className={`${styles.message} ${styles[message.type]}`}>
                <div className={styles.messageContent}>
                  {message.content}
                </div>
                <div className={styles.messageTime}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className={styles.loadingIndicator}>
                AI is thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleChatSubmit} className={styles.inputContainer}>
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => handleInputValue(e.target.value)}
              placeholder={placeholder}
              className={styles.input}
              disabled={isChatLoading}
            />
            <button 
              type="submit" 
              className={styles.sendButton}
              disabled={isChatLoading || !userQuestion.trim()}
            >
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AIChatBot;
