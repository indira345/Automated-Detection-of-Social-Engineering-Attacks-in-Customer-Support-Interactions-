import React from 'react';

function ResultsCard({ results }) {
  // Debug log to see what data we're receiving
  console.log('ResultsCard received:', results);
  
  const getScoreColor = (confidence) => {
    if (confidence >= 0.5) return '#dc3545';
    if (confidence >= 0.25) return '#ffc107';
    return '#28a745';
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel === 'High') return '#dc3545';
    if (riskLevel === 'Medium') return '#ffc107';
    return '#28a745';
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📊 Analysis Results</h3>
      
      <div style={styles.section}>
        <h4 style={{ margin: '0 0 12px 0', color: '#667eea', fontSize: '16px', fontWeight: '600' }}>🎯 Scam Type</h4>
        <p style={{
          ...styles.scamType,
          color: results.confidence >= 0.5 ? '#dc3545' : results.confidence >= 0.25 ? '#ffc107' : '#333'
        }}>
          {results.scam_type}
        </p>
      </div>

      <div style={styles.section}>
        <h4 style={{ margin: '0 0 12px 0', color: '#667eea', fontSize: '16px', fontWeight: '600' }}>📈 Risk Assessment</h4>
        <div style={styles.scoreContainer}>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${results.confidence * 100}%`,
                backgroundColor: getScoreColor(results.confidence)
              }}
            />
          </div>
          <span style={{...styles.scoreText, color: getRiskColor(results.risk_level)}}>
            {(results.confidence * 100).toFixed(1)}% - {results.risk_level} Risk
          </span>
        </div>
      </div>

      <div style={styles.section}>
        <h4 style={{ margin: '0 0 12px 0', color: '#667eea', fontSize: '16px', fontWeight: '600' }}>🏷️ Classification</h4>
        <div style={styles.classification}>
          <span style={{
            ...styles.classificationBadge,
            backgroundColor: results.confidence >= 0.5 ? '#dc3545' : results.confidence >= 0.25 ? '#ffc107' : '#28a745'
          }}>
            {results.confidence >= 0.5 ? '🚨 SCAM' : results.confidence >= 0.25 ? '⚠️ MIGHT BE SPAM' : '✅ NOT SPAM'}
          </span>
        </div>
      </div>

      {results.indicators && results.indicators.length > 0 && (
        <div style={styles.section}>
          <h4 style={{ margin: '0 0 12px 0', color: '#667eea', fontSize: '16px', fontWeight: '600' }}>🔍 Triggered Indicators</h4>
          <div style={styles.indicators}>
            {results.indicators.map((indicator, index) => (
              <span key={index} style={styles.indicator}>
                {indicator}
              </span>
            ))}
          </div>
        </div>
      )}

      {results.extracted_text && (
        <div style={styles.section}>
          <h4 style={{ margin: '0 0 12px 0', color: '#667eea', fontSize: '16px', fontWeight: '600' }}>📝 Extracted Text</h4>
          <div style={styles.extractedText}>
            {results.extracted_text}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
    marginTop: '30px',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  title: {
    margin: '0 0 25px 0',
    color: '#333',
    fontSize: '24px',
    fontWeight: '700',
    borderBottom: '3px solid',
    borderImage: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%) 1',
    paddingBottom: '12px'
  },
  section: {
    marginBottom: '25px',
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  scamType: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '8px 0',
    padding: '12px 16px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
    display: 'inline-block'
  },
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  progressBar: {
    flex: 1,
    height: '12px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.6s ease',
    borderRadius: '10px'
  },
  scoreText: {
    fontSize: '16px',
    fontWeight: 'bold',
    minWidth: '140px',
    padding: '8px 12px',
    borderRadius: '8px',
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  indicators: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px'
  },
  indicator: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#333',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  noIndicators: {
    color: '#6c757d',
    fontStyle: 'italic',
    margin: 0
  },
  classification: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '15px'
  },
  classificationBadge: {
    padding: '12px 24px',
    borderRadius: '25px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  extractedText: {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '10px',
    border: '2px solid #e9ecef',
    fontSize: '14px',
    maxHeight: '180px',
    overflowY: 'auto',
    lineHeight: '1.6',
    fontFamily: 'monospace'
  }
};

export default ResultsCard;