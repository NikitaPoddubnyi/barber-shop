import React, { useState, useEffect, useRef } from 'react';
import styles from './Notification.module.scss';

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progressKey, setProgressKey] = useState(0);
  const notificationRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    setProgressKey(prev => prev + 1);

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [message, type, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  return (
    <div 
      className={`${styles.notification} ${styles[type]} ${isVisible ? styles.visible : styles.hidden}`}
      ref={notificationRef}
    >
      <div className={styles.notificationContent}>
        <span className={styles.notificationIcon}>
          {type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'}
        </span>
        <span className={styles.notificationMessage}>
          {message.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < message.length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
        <button 
          className={styles.notificationClose}
          onClick={handleClose}
          aria-label="Закрити повідомлення"
        >
          &times;
        </button>
      </div>
      {duration > 0 && (
        <div className={styles.notificationProgress}>
          <div 
            key={progressKey}
            className={styles.notificationProgressBar}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default Notification;