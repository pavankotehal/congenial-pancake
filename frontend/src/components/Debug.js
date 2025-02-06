import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Debug.css';

function Debug() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`debug-panel ${isVisible ? 'visible' : ''}`}>
      <button 
        className="debug-toggle"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'Hide Debug' : 'Show Debug'}
      </button>
      
      {isVisible && (
        <div className="debug-content">
          <h4>Debug Info</h4>
          <pre>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Debug; 