import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NotificationIcon() {
  const [notifications, setNotifications] = useState([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [scamUnread, setScamUnread] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:8000/api/chat/unread-notifications',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data.notifications);
      setTotalUnread(response.data.total_unread);
      setScamUnread(response.data.scam_unread || 0);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getScamIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return '🚨';
      case 'Medium': return '⚠️';
      case 'Low': return '⚡';
      default: return '🚨';
    }
  };

  const getScamColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return '#dc3545';
      case 'Medium': return '#fd7e14';
      case 'Low': return '#ffc107';
      default: return '#dc3545';
    }
  };

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.iconContainer,
        backgroundColor: scamUnread > 0 ? '#ffe6e6' : 'transparent'
      }} onClick={toggleDropdown}>
        <span style={{
          ...styles.icon,
          color: scamUnread > 0 ? '#dc3545' : 'inherit'
        }}>🔔</span>
        {totalUnread > 0 && (
          <span style={{
            ...styles.badge,
            backgroundColor: scamUnread > 0 ? '#dc3545' : '#007bff'
          }}>
            {totalUnread > 99 ? '99+' : totalUnread}
          </span>
        )}
        {scamUnread > 0 && (
          <span style={styles.scamBadge}>
            🚨
          </span>
        )}
      </div>
      
      {showDropdown && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <h4>Notifications</h4>
            {scamUnread > 0 && (
              <span style={styles.scamCounter}>
                {scamUnread} scam alert{scamUnread > 1 ? 's' : ''}
              </span>
            )}
            {loading && <span style={styles.loadingText}>Loading...</span>}
          </div>
          
          <div style={styles.notificationsList}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notif, index) => (
                <div key={index} style={{
                  ...styles.notificationItem,
                  backgroundColor: notif.is_scam ? '#ffe6e6' : 'white',
                  borderLeft: notif.is_scam ? `4px solid ${getScamColor(notif.risk_level)}` : 'none'
                }}>
                  <div style={styles.notificationContent}>
                    <div style={styles.senderRow}>
                      <strong>{notif.sender_username}</strong>
                      {notif.is_scam && (
                        <span style={{
                          ...styles.scamTag,
                          backgroundColor: getScamColor(notif.risk_level)
                        }}>
                          {getScamIcon(notif.risk_level)} SCAM
                        </span>
                      )}
                    </div>
                    <p style={{
                      ...styles.message,
                      color: notif.is_scam ? '#721c24' : '#333'
                    }}>{notif.message}</p>
                    <div style={styles.metaRow}>
                      <span style={styles.time}>{formatTime(notif.timestamp)}</span>
                      {notif.is_scam && (
                        <span style={styles.confidenceText}>
                          {Math.round(notif.scam_confidence * 100)}% risk
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {showDropdown && (
        <div style={styles.overlay} onClick={() => setShowDropdown(false)} />
      )}
    </div>
  );
}

const styles = {
  container: { position: 'relative' },
  iconContainer: { 
    position: 'relative', 
    cursor: 'pointer', 
    padding: '8px',
    borderRadius: '50%',
    transition: 'background-color 0.2s'
  },
  icon: { fontSize: '24px' },
  badge: {
    position: 'absolute',
    top: '0',
    right: '0',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
    fontWeight: 'bold',
    minWidth: '18px',
    textAlign: 'center'
  },
  scamBadge: {
    position: 'absolute',
    top: '-5px',
    left: '-5px',
    fontSize: '16px',
    animation: 'pulse 1.5s infinite'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    width: '320px',
    maxHeight: '400px',
    zIndex: 1000,
    marginTop: '10px'
  },
  dropdownHeader: {
    padding: '15px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px'
  },
  scamCounter: {
    fontSize: '12px',
    color: '#dc3545',
    fontWeight: 'bold',
    backgroundColor: '#ffe6e6',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  loadingText: { fontSize: '12px', color: '#666' },
  notificationsList: {
    maxHeight: '300px',
    overflowY: 'auto'
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: '#999'
  },
  notificationItem: {
    padding: '12px 15px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  notificationContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  senderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scamTag: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '2px'
  },
  message: {
    margin: 0,
    fontSize: '14px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  time: {
    fontSize: '12px',
    color: '#666'
  },
  confidenceText: {
    fontSize: '11px',
    color: '#dc3545',
    fontWeight: 'bold'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999
  }
};

export default NotificationIcon;
