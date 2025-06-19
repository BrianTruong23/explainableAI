// src/components/TokenAttribution.jsx
const TokenAttribution = ({ tokens, attributions, classIndex }) => {
    const maxAttribution = Math.max(...attributions.map(val => Math.abs(val)), 1e-6);
  
    const getTokenStyle = (attribution) => {
      const norm = Math.abs(attribution) / maxAttribution;
      const backgroundColor = attribution < 0
        ? `rgba(255, 0, 0, ${norm})` // red for opposing
        : `rgba(0, 0, 255, ${norm})`; // blue for supporting
  
      return {
        backgroundColor,
        color: '#000',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '14px',
        display: 'inline-block',
        margin: '2px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
      };
    };
  
    return (
      <div style={{ marginTop: '10px' }}>
        {/* Optional Color Legend */}
        <div style={{ fontSize: '12px', marginBottom: '8px' }}>
          <span style={{ backgroundColor: 'rgba(255, 0, 0, 0.3)', padding: '2px 4px', marginRight: '6px' }}>
            Red = Opposes class {classIndex}
          </span>
          <span style={{ backgroundColor: 'rgba(0, 0, 255, 0.3)', padding: '2px 4px' }}>
            Blue = Supports class {classIndex}
          </span>
        </div>
  
        {/* Tokens with styled attributions */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '4px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          {tokens.map((token, index) => (
            <span
            key={index}
            style={{ position: 'relative', ...getTokenStyle(attributions[index]) }}
            onMouseEnter={(e) => {
                const tooltip = e.currentTarget.querySelector('.tooltip-text');
                tooltip.style.opacity = 1;
                tooltip.style.visibility = 'visible';
            }}
            onMouseLeave={(e) => {
                const tooltip = e.currentTarget.querySelector('.tooltip-text');
                tooltip.style.opacity = 0;
                tooltip.style.visibility = 'hidden';
            }}
            >
            {token}
            <span
                className="tooltip-text"
                style={{
                position: 'absolute',
                bottom: '125%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#333',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                opacity: 0,
                visibility: 'hidden',
                transition: 'opacity 0.2s ease, visibility 0.2s ease',
                zIndex: 10,
                }}
            >
                {attributions[index] > 0 ? 'Supports' : 'Opposes'} class {classIndex} ({attributions[index].toFixed(4)})
            </span>
            </span>
         
        
            
          ))}
        </div>
      </div>
    );
  };
  
  export default TokenAttribution;
  