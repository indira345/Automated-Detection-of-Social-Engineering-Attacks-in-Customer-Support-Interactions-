import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import Loading from './Loading';

function ChatWindow({ currentUser, otherUser, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async (showLoading = false) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/chat/chat-history/${otherUser}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      if (showLoading) setInitialLoading(false);
    }
  }, [otherUser]);

  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 2000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/chat/send-message',
        {
          sender_username: currentUser,
          receiver_username: otherUser,
          message: newMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
      fetchMessages(false);
      if (onNewMessage) onNewMessage();
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.messagesContainer}>
        {initialLoading ? (
          <Loading message="Loading messages..." />
        ) : messages.length === 0 ? (
          <div style={styles.emptyMessages}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble
              key={index}
              message={msg.message}
              isSender={msg.sender_username === currentUser}
              timestamp={msg.timestamp}
              isScam={msg.is_scam || false}
              scamType={msg.scam_type || 'Not Spam'}
              riskLevel={msg.risk_level || 'Low'}
              scamConfidence={msg.scam_confidence || 0}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          style={styles.input}
          disabled={sending}
        />
        <button 
          onClick={handleSend} 
          style={{
            ...styles.sendBtn,
            opacity: sending ? 0.6 : 1,
            cursor: sending ? 'not-allowed' : 'pointer'
          }}
          disabled={sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%' },
  messagesContainer: { flex: 1, overflowY: 'auto', padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px', marginBottom: '8px', maxHeight: 'calc(100vh - 200px)' },
  emptyMessages: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' },
  inputContainer: { display: 'flex', gap: '8px', padding: '5px 0' },
  input: { flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  sendBtn: { padding: '10px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'opacity 0.2s', fontSize: '14px' }
};

export default ChatWindow;
