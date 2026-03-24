import React from 'react';

function Loading({ message = 'Loading...' }) {
  return (
    <div style={styles.container}>
      <div className="spinner" style={styles.spinner}></div>
      <p style={styles.text}>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    width: '40px',
    height: '40px'
  },
  text: {
    marginTop: '10px',
    color: '#666'
  }
};

export default Loading;
