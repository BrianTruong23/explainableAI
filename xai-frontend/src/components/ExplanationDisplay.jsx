import React from 'react';

const ExplanationDisplay = ({ explanation, loading = false }) => {
  if (loading) {
    return <div className="explanation-loading">Loading explanation...</div>;
  }

  if (!explanation) {
    return null;
  }

  return (
    <div className="explanation-display">
      <h3>Model Explanation</h3>
      <div className="explanation-content">
        {typeof explanation === 'object' ? (
          <div className="explanation-details">
            {Object.entries(explanation).map(([key, value]) => (
              <div key={key} className="explanation-item">
                <h4>{key}</h4>
                <p>{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>{explanation}</p>
        )}
      </div>
    </div>
  );
};

export default ExplanationDisplay; 