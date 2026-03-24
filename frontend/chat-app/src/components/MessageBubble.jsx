import React from 'react';

function MessageBubble({ message, isSender, timestamp, isScam, scamType, riskLevel, scamConfidence }) {
  const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getScamAlertColor = () => {
    if (!isScam) return null;
    switch (riskLevel) {
      case 'High': return '#dc3545';
      case 'Medium': return '#fd7e14';
      case 'Low': return '#ffc107';
      default: return '#dc3545';
    }
  };

  const getScamIcon = () => {
    if (!isScam) return null;
    switch (riskLevel) {
      case 'High': return '🚨';
      case 'Medium': return '⚠️';
      case 'Low': return '⚡';
      default: return '🚨';
    }
  };

  return (
    <div style={{
      ...styles.container,
      justifyContent: isSender ? 'flex-end' : 'flex-start'
    }}>
      <div style={{
        ...styles.bubble,
        backgroundColor: isScam ? (isSender ? '#ffcccc' : '#ffe6e6') : (isSender ? '#007bff' : '#e9ecef'),
        color: isScam ? '#721c24' : (isSender ? 'white' : 'black'),
        border: isScam ? `2px solid ${getScamAlertColor()}` : 'none'
      }}>
        {isScam && (
          <div style={{
            ...styles.scamAlert,
            backgroundColor: getScamAlertColor()
          }}>
            <span style={styles.scamIcon}>{getScamIcon()}</span>
            <span style={styles.scamText}>SCAM ALERT - {scamType}</span>
          </div>
        )}
        <p style={styles.message}>{message}</p>
        <div style={styles.footer}>
          <span style={styles.timestamp}>{time}</span>
          {isScam && (
            <span style={{
              ...styles.confidenceTag,
              backgroundColor: getScamAlertColor()
            }}>
              {Math.round(scamConfidence * 100)}% risk
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', marginBottom: '10px' },
  bubble: { maxWidth: '60%', padding: '10px 15px', borderRadius: '18px', wordWrap: 'break-word', position: 'relative' },
  message: { margin: 0, marginBottom: '5px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' },
  timestamp: { fontSize: '10px', opacity: 0.7 },
  scamAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 8px',
    borderRadius: '12px',
    marginBottom: '8px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: 'white'
  },
  scamIcon: { fontSize: '12px' },
  scamText: { fontSize: '10px' },
  confidenceTag: {
    fontSize: '9px',
    padding: '2px 6px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold'
  }
};

export default MessageBubble;
