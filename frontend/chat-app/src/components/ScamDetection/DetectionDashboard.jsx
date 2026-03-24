import React, { useState } from 'react';
import axios from 'axios';
import ResultsCard from './ResultsCard';

function DetectionDashboard() {
  const [inputMode, setInputMode] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please drop a valid image file');
    }
  };

  const handleAnalyze = async () => {
    if (!textInput.trim() && !selectedFile) {
      setError('Please provide text or upload an image');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      let response;
      
      if (inputMode === 'image' && selectedFile) {
        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(selectedFile);
        });
        
        const base64Data = await base64Promise;
        
        response = await axios.post(
          'http://localhost:8000/api/spam-detection/analyze-image',
          { image_data: base64Data },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          'http://localhost:8000/api/spam-detection/analyze-text',
          { text: textInput },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      setResults(response.data.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '700' }}>🔍 AI-Powered Spam Detection</h2>
        <p style={styles.description}>
          Advanced machine learning technology to identify and protect against malicious content and scam attempts.
        </p>
      </div>

      <div style={styles.toggleContainer}>
        <button
          style={{...styles.toggleBtn, ...(inputMode === 'text' ? styles.activeToggle : {})}}
          onClick={() => setInputMode('text')}
        >
          📝 Paste Text
        </button>
        <button
          style={{...styles.toggleBtn, ...(inputMode === 'image' ? styles.activeToggle : {})}}
          onClick={() => setInputMode('image')}
        >
          📷 Upload Screenshot
        </button>
      </div>

      <div style={styles.inputSection}>
        {inputMode === 'text' ? (
          <textarea
            placeholder="Paste suspicious text here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            style={styles.textarea}
            rows={6}
          />
        ) : (
          <div
            style={styles.dropZone}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('fileInput').click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.backgroundColor = '#f0f4ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d0d0d0';
              e.currentTarget.style.backgroundColor = '#fafafa';
            }}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={styles.hiddenInput}
            />
            {selectedFile ? (
              <div style={styles.fileSelected}>
                <span>📁 {selectedFile.name}</span>
                <button onClick={(e) => {e.stopPropagation(); setSelectedFile(null);}} style={styles.removeBtn}>
                  ✕
                </button>
              </div>
            ) : (
              <div style={styles.dropText}>
                <p>📤 Drag & drop an image here or click to browse</p>
                <p style={styles.dropSubtext}>Supports JPG, PNG, GIF formats</p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || (!textInput.trim() && !selectedFile)}
        style={{
          ...styles.analyzeBtn,
          opacity: isAnalyzing || (!textInput.trim() && !selectedFile) ? 0.6 : 1
        }}
      >
        {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze'}
      </button>

      {results && <ResultsCard results={results} />}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    color: 'white',
    boxShadow: '0 10px 40px rgba(102,126,234,0.3)'
  },
  description: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: '15px',
    margin: '15px 0 0 0',
    lineHeight: '1.6'
  },
  toggleContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    justifyContent: 'center',
    padding: '8px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  toggleBtn: {
    padding: '14px 32px',
    border: '2px solid transparent',
    backgroundColor: 'transparent',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '15px',
    fontWeight: '600',
    color: '#666'
  },
  activeToggle: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
    transform: 'translateY(-2px)'
  },
  inputSection: {
    marginBottom: '25px',
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  textarea: {
    width: '100%',
    padding: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s',
    outline: 'none',
    boxSizing: 'border-box'
  },
  dropZone: {
    border: '3px dashed #d0d0d0',
    borderRadius: '12px',
    padding: '50px 40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    backgroundColor: '#fafafa',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hiddenInput: {
    display: 'none'
  },
  fileSelected: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    padding: '20px',
    background: 'linear-gradient(135deg, #e0f7fa 0%, #e1bee7 100%)',
    borderRadius: '10px'
  },
  removeBtn: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 12px rgba(245,87,108,0.3)'
  },
  dropText: {
    color: '#666'
  },
  dropSubtext: {
    fontSize: '13px',
    color: '#999',
    margin: '8px 0 0 0'
  },
  error: {
    backgroundColor: '#ffe5e5',
    color: '#c62828',
    padding: '14px 18px',
    borderRadius: '10px',
    marginBottom: '15px',
    border: '1px solid #ffcdd2',
    fontSize: '14px',
    fontWeight: '500'
  },
  analyzeBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 6px 20px rgba(17,153,142,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
};

export default DetectionDashboard;