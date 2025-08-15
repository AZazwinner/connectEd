import React from 'react';
import './StreakTracker.css';

interface StreakTrackerProps {
  currentStreak: number;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ currentStreak }) => {
  // We'll create an array of 7 elements to represent the days of the week.
  const weekDays = Array.from({ length: 7 });

  return (
    <div className="stat-card streak-tracker">
      <div className="streak-header">
        <h2>Your Streak</h2>
      </div>
      <div className="streak-display">
        <span className="streak-number">{currentStreak}</span>
        <span className="streak-emoji">🔥</span>
      </div>
      <p className="streak-subtext">Log in each day to keep your streak going!</p>
      <div className="week-flames">
        {weekDays.map((_, index) => {
          // For the UI, we'll light up flames based on the current streak count.
          // The last 'currentStreak' flames will be lit.
          const isLit = index >= 7 - currentStreak;
          return (
            <div key={index} className={`flame-day ${isLit ? 'lit' : ''}`}>
              <span>🔥</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StreakTracker;