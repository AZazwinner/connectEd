import React from 'react';
import './AchievementCard.css';
import type { Achievement } from '../lib/achievements';
import type { AchievementProgress } from '../lib/userProfile';

interface AchievementCardProps {
  achievement: Achievement;
  progress: AchievementProgress;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, progress }) => {
  const isUnlocked = progress.unlockedAt !== null;
  // Calculate progress, ensuring it doesn't go over 100%
  const progressPercent = Math.min((progress.currentProgress / achievement.goal) * 100, 100);

  return (
    <div className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
      <div className="achievement-icon">{isUnlocked ? '🏆' : '🔒'}</div>
      <div className="achievement-details">
        <h4 className="achievement-title">{achievement.title}</h4>
        <p className="achievement-description">{achievement.description}</p>
        {!isUnlocked && (
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;