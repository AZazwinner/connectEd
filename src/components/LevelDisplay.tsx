import React from 'react';
import './LevelDisplay.css';
import { getXpForLevel, calculateLevelFromXp } from '../lib/gameBalance';

interface LevelDisplayProps {
  title: string;
  icon: string;
  totalXp: number; // We now pass totalXp instead of a level
}

const LevelDisplay: React.FC<LevelDisplayProps> = ({ title, icon, totalXp }) => {
  // Calculate everything needed for the UI from the total XP
  const currentLevel = calculateLevelFromXp(totalXp);
  const xpForCurrentLevel = getXpForLevel(currentLevel);
  const xpForNextLevel = getXpForLevel(currentLevel + 1);
  
  const xpInCurrentLevel = totalXp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  
  // Calculate progress percent, handling the edge case of level 1 (0/200 XP)
  const progressPercent = xpNeededForNextLevel > 0 ? (xpInCurrentLevel / xpNeededForNextLevel) * 100 : 0;

  return (
    <div className="stat-card level-display">
      <div className="level-header">
        <div className="level-icon">{icon}</div>
        <div className="level-info">
          <h3 className="level-title">{title}</h3>
          <p className="level-number">Level {currentLevel}</p>
        </div>
      </div>
      <div className="level-progress-bar-container">
        <div 
          className="level-progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <p className="xp-text">{xpInCurrentLevel.toLocaleString()} / {xpNeededForNextLevel.toLocaleString()} XP</p>
    </div>
  );
};

export default LevelDisplay;