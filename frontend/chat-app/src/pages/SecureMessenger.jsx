import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatWindow from '../components/ChatWindow';
import Loading from '../components/Loading';
import NotificationIcon from '../components/NotificationIcon';

function SecureMessenger() {
  const [searchUsername, setSearchUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatContacts, setChatContacts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username');

  useEffect(() => {
    fetchChatContacts();
    const interval = setInterval(fetchChatContacts, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchChatContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:8000/api/chat/chat-contacts',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChatContacts(response.data);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchUsername.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/chat/search-user/${searchUsername}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedUser(response.data);
      setSearchUsername('');
    } catch (err) {
      setError(err.response?.data?.detail || 'User not found');
      setSelectedUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContact = (username) => {
    setSelectedUser({ username });
    setError('');
  };

  const handleNewMessage = () => {
    fetchChatContacts();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '28px', fontWeight: '700' }}>🔒 Secure Messenger</h2>
        <div style={styles.headerRight}>
          <NotificationIcon />
          <button onClick={() => navigate('/home')} style={styles.backBtn}>Back to Home</button>
        </div>
      </div>
      
      <div style={styles.mainContainer}>
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Chats</h3>
          
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search new user..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={styles.searchInput}
            />
            <button onClick={handleSearch} style={styles.searchBtn} disabled={loading}>
              {loading ? '...' : '🔍'}
            </button>
          </div>
          
          {error && <p style={styles.error}>{error}</p>}
          
          <div style={styles.contactsList}>
            {contactsLoading ? (
              <Loading message="Loading chats..." />
            ) : chatContacts.length === 0 ? (
              <p style={styles.noChats}>No chats yet. Search for a user to start chatting!</p>
            ) : (
              chatContacts.map((contact, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.contactItem,
                    backgroundColor: selectedUser?.username === contact.username ? 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' : 'white',
                    borderLeft: selectedUser?.username === contact.username ? '4px solid #667eea' : '4px solid transparent'
                  }}
                  onClick={() => handleSelectContact(contact.username)}
                  onMouseEnter={(e) => {
                    if (selectedUser?.username !== contact.username) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUser?.username !== contact.username) {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <div style={styles.contactInfo}>
                    <div style={styles.contactHeader}>
                      <strong>{contact.username}</strong>
                      {contact.unread_count > 0 && (
                        <span style={styles.unreadBadge}>
                          {contact.unread_count}
                        </span>
                      )}
                    </div>
                    <p style={{
                      ...styles.lastMessage,
                      fontWeight: contact.unread_count > 0 ? 'bold' : 'normal',
                      color: contact.unread_count > 0 ? '#000' : '#666'
                    }}>
                      {contact.last_message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div style={styles.chatArea}>
          {selectedUser ? (
            <div style={styles.chatContainer}>
              <div style={styles.userInfo}>
                <h3>Chat with: {selectedUser.username}</h3>
              </div>
              <ChatWindow 
                currentUser={currentUser} 
                otherUser={selectedUser.username}
                onNewMessage={handleNewMessage}
              />
            </div>
          ) : (
            <div style={styles.emptyState}>
              <h3>👋 Welcome to Secure Messenger</h3>
              <p>Select a chat from the sidebar or search for a new user to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    padding: '20px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    minHeight: '100vh' 
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '20px', 
    padding: '20px', 
    background: 'rgba(255,255,255,0.95)', 
    borderRadius: '12px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)' 
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  backBtn: { 
    padding: '10px 20px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontSize: '14px', 
    fontWeight: '600',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
  },
  mainContainer: { 
    display: 'flex', 
    gap: '20px', 
    height: 'calc(100vh - 140px)' 
  },
  sidebar: { 
    width: '340px', 
    background: 'rgba(255,255,255,0.95)', 
    borderRadius: '12px', 
    padding: '20px', 
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
    display: 'flex', 
    flexDirection: 'column',
    backdropFilter: 'blur(10px)'
  },
  sidebarTitle: { 
    marginTop: 0, 
    marginBottom: '20px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '24px',
    fontWeight: '700'
  },
  searchContainer: { 
    display: 'flex', 
    gap: '8px', 
    marginBottom: '20px' 
  },
  searchInput: { 
    flex: 1, 
    padding: '12px 16px', 
    border: '2px solid #e0e0e0', 
    borderRadius: '10px', 
    fontSize: '14px',
    transition: 'border-color 0.3s',
    outline: 'none'
  },
  searchBtn: { 
    padding: '12px 20px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: 'white', 
    border: 'none', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    fontSize: '16px',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
  },
  error: { 
    color: '#e74c3c', 
    fontSize: '13px', 
    marginBottom: '10px',
    padding: '8px 12px',
    background: '#ffe5e5',
    borderRadius: '6px'
  },
  contactsList: { 
    flex: 1, 
    overflowY: 'auto',
    paddingRight: '5px'
  },
  contactItem: { 
    padding: '14px', 
    cursor: 'pointer', 
    transition: 'all 0.3s', 
    borderRadius: '10px', 
    marginBottom: '8px',
    border: '1px solid #f0f0f0',
    background: 'white'
  },
  contactInfo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  contactHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  unreadBadge: { 
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
    color: 'white', 
    borderRadius: '12px', 
    padding: '4px 10px', 
    fontSize: '11px', 
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(245,87,108,0.4)'
  },
  lastMessage: { 
    margin: 0, 
    fontSize: '13px', 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap',
    color: '#666'
  },
  noChats: { 
    textAlign: 'center', 
    color: '#999', 
    fontSize: '14px', 
    marginTop: '40px',
    padding: '20px'
  },
  chatArea: { 
    flex: 1, 
    background: 'rgba(255,255,255,0.95)', 
    borderRadius: '12px', 
    padding: '20px', 
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)'
  },
  chatContainer: { height: '100%', display: 'flex', flexDirection: 'column' },
  userInfo: { 
    borderBottom: '2px solid #f0f0f0', 
    paddingBottom: '15px', 
    marginBottom: '20px' 
  },
  emptyState: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100%', 
    color: '#999', 
    textAlign: 'center',
    gap: '10px'
  }
};

export default SecureMessenger;
