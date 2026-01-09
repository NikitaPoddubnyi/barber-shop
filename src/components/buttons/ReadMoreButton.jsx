import React, { useState, useRef } from 'react';
import styles from 'styles/Main.module.scss';
import { useScrollAnimation } from 'hooks/useScrollAnimation';

const ReadMoreButton = ({children}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ref, active] = useScrollAnimation(0.9);
  const containerRef = useRef(null);

  const handleToggle = () => {
    const willCollapse = !isExpanded; 
    
    setIsExpanded((prev) => !prev);
    
    if (!willCollapse && containerRef.current) {
      setTimeout(() => {
        containerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      }, 10); 
    }
  };
  
  return (
    <div ref={containerRef}>
      {isExpanded && (
        <div className={styles.additionalContent}>
          {children}
        </div>
      )}
      <button 
        ref={ref}
        className={`${styles.readMoreButton} ${isExpanded ? styles.expanded : ''} ${active ? styles.active : ''}`}
        onClick={handleToggle}
      >
        {isExpanded ? (
          <>
            <span>Згорнути</span>
            <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        ) : (
          <>
            <span>Читати далі</span>
            <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default ReadMoreButton;