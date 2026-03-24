import React from 'react';
import { useNavigate } from 'react-router-dom';
import DetectionDashboard from '../components/ScamDetection/DetectionDashboard';

function ScamDetection() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/home')} style={styles.backBtn}>
          ← Back to Home
        </button>
        <h1>Scam Detection System</h1>
      </div>
      <DetectionDashboard />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
    maxWidth: '800px',
    margin: '0 auto 20px auto'
  },
  backBtn: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default ScamDetection;