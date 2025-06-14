import React from 'react';

const ResultDisplay = ({ result, loading = false }) => {
  if (loading) {
    return <div className="result-loading">Loading results...</div>;
  }

  if (!result) {
    return null;
  }

  return (
    <div className="result-display">
      <h3>Model Result</h3>
      <div className="result-content">
        {typeof result === 'object' ? (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        ) : (
          <p>{result}</p>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay; 