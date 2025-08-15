import React, { useEffect } from 'react';
import './AchievementToast.css';
import type { Achievement } from '../lib/achievements';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void; // A function to call to dismiss the toast
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  // Automatically close the toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [onClose]);

  return (
    <div className="achievement-toast-container">
      <div className="toast-icon">🏆</div>
      <div className="toast-details">
        <h3 className="toast-title">Achievement Unlocked!</h3>
        <p className="toast-description">{achievement.title}</p>
      </div>
      <button onClick={onClose} className="toast-close-btn">&times;</button>
    </div>
  );
};

export default AchievementToast;