import React from 'react';

const Spinner: React.FC<{ fullPage?: boolean }> = ({ fullPage }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: fullPage ? '0' : '40px', height: fullPage ? '100vh' : 'auto' }}>
    <div style={{ width: 40, height: 40, border: '3px solid #f3f3f3', borderTop: '3px solid #C8102E', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Spinner;
