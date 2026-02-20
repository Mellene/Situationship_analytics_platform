import React from 'react';

const GradientWave: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 0,
      background: '#fff'
    }}>
      <svg
        viewBox="0 0 1440 800"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          filter: 'blur(80px)',
          opacity: 0.7
        }}
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fb7185', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#e879f9', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a3e635', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#fb7185', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        <circle cx="200" cy="200" r="400" fill="url(#grad1)">
          <animate attributeName="cx" values="200;1200;200" dur="20s" repeatCount="indefinite" />
          <animate attributeName="cy" values="200;600;200" dur="25s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="1200" cy="600" r="450" fill="url(#grad2)">
          <animate attributeName="cx" values="1200;200;1200" dur="18s" repeatCount="indefinite" />
          <animate attributeName="cy" values="600;200;600" dur="22s" repeatCount="indefinite" />
        </circle>

        <circle cx="700" cy="400" r="300" fill="#fb7185" opacity="0.5">
          <animate attributeName="r" values="300;500;300" dur="15s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default GradientWave;
