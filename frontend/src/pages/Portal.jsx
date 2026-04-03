import React, { useState } from 'react';
import Uploader from '../components/Uploader';
import Dashboard from '../components/Dashboard';

function Portal() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="portal-container animate-fade">
      <header className="portal-header">
        <h2>Intelligence Dashboard</h2>
      </header>

      <main className="main-content">
        {!analysisData && !isLoading && (
          <Uploader 
            setAnalysisData={setAnalysisData} 
            setIsLoading={setIsLoading} 
            setError={setError} 
          />
        )}

        {isLoading && (
          <div className="glass-panel animate-fade" style={{ textAlign: 'center', width: '100%', margin: '0' }}>
            <div className="custom-loader"></div>
            <h3>Extracting Intelligence...</h3>
            <p>Our deep learning models are parsing entities and calculating vectors.</p>
          </div>
        )}

        {error && (
          <div className="glass-panel" style={{ borderColor: 'var(--danger-color)', color: 'var(--danger-color)', width: '100%', margin: '0', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {analysisData && !isLoading && (
          <Dashboard data={analysisData} onReset={() => setAnalysisData(null)} />
        )}
      </main>
    </div>
  );
}

export default Portal;
