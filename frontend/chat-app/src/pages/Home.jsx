import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from '../components/NotificationIcon';

function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🛡️ OCR Spam Detection</h1>
          <p style={styles.subtitle}>Welcome back, <strong>{username}</strong>!</p>
        </div>
        <div style={styles.headerRight}>
          <NotificationIcon />
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>
      
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>AI-Powered Protection Against Scams</h2>
        <p style={styles.heroText}>Advanced machine learning technology to detect and prevent spam, scams, and malicious content</p>
      </div>

      <div style={styles.optionsContainer}>
        <div 
          style={styles.card} 
          onClick={() => navigate('/scam-detection')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(102,126,234,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
          }}
        >
          <div style={styles.cardIcon}>🔍</div>
          <h3 style={styles.cardTitle}>Scam Detection</h3>
          <p style={styles.cardText}>Analyze text and images for spam patterns using advanced ML algorithms</p>
          <div style={styles.cardFeatures}>
            <span style={styles.feature}>✓ Text Analysis</span>
            <span style={styles.feature}>✓ Image OCR</span>
            <span style={styles.feature}>✓ Real-time Detection</span>
          </div>
        </div>
        
        <div 
          style={styles.card} 
          onClick={() => navigate('/messenger')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(102,126,234,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
          }}
        >
          <div style={styles.cardIcon}>💬</div>
          <h3 style={styles.cardTitle}>Secure Messenger</h3>
          <p style={styles.cardText}>Chat securely with automatic spam detection and real-time protection</p>
          <div style={styles.cardFeatures}>
            <span style={styles.feature}>✓ End-to-End Security</span>
            <span style={styles.feature}>✓ Auto Spam Filter</span>
            <span style={styles.feature}>✓ Real-time Alerts</span>
          </div>
        </div>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>95%+</div>
          <div style={styles.statLabel}>Accuracy</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>24/7</div>
          <div style={styles.statLabel}>Protection</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>Real-time</div>
          <div style={styles.statLabel}>Detection</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    padding: '30px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    minHeight: '100vh' 
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '40px',
    padding: '25px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  },
  title: {
    margin: 0,
    fontSize: '28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '700'
  },
  subtitle: {
    margin: '8px 0 0 0',
    color: '#666',
    fontSize: '16px'
  },
  headerRight: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px' 
  },
  logoutBtn: { 
    padding: '12px 24px', 
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
    color: 'white', 
    border: 'none', 
    borderRadius: '10px', 
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(245,87,108,0.4)'
  },
  hero: {
    textAlign: 'center',
    padding: '50px 20px',
    marginBottom: '40px'
  },
  heroTitle: {
    fontSize: '42px',
    color: 'white',
    margin: '0 0 20px 0',
    fontWeight: '700',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  heroText: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.95)',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.6'
  },
  optionsContainer: { 
    display: 'flex', 
    gap: '30px', 
    justifyContent: 'center', 
    flexWrap: 'wrap',
    marginBottom: '50px'
  },
  card: { 
    background: 'rgba(255,255,255,0.95)', 
    padding: '40px 30px', 
    borderRadius: '20px', 
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)', 
    width: '320px', 
    cursor: 'pointer', 
    textAlign: 'center', 
    transition: 'all 0.4s',
    backdropFilter: 'blur(10px)'
  },
  cardIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  cardTitle: {
    fontSize: '24px',
    margin: '0 0 15px 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '700'
  },
  cardText: {
    color: '#666',
    fontSize: '15px',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  cardFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '20px'
  },
  feature: {
    fontSize: '13px',
    color: '#667eea',
    fontWeight: '600',
    textAlign: 'left',
    padding: '8px 12px',
    background: 'rgba(102,126,234,0.1)',
    borderRadius: '6px'
  },
  statsContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  statCard: {
    background: 'rgba(255,255,255,0.95)',
    padding: '30px 40px',
    borderRadius: '16px',
    textAlign: 'center',
    minWidth: '150px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '600'
  }
};

export default Home;
