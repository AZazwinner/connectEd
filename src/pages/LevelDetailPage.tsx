// src/pages/LevelDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MATH_CURRICULUM, getLevelIcon } from '../lib/curriculum';

// Import all the necessary helpers for progress and syncing
import { isSkillMastered, setUnlockedLevel } from '../lib/progress';
import { countBankedQuestionsForLevel } from '../lib/database';
import { syncQuestionsForLevel } from '../lib/sync';

import './LevelDetailPage.css';

const LevelDetailPage: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  
  // State to manage the initial data sync when the page loads
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Checking question bank...");

  // Effect to handle the offline question syncing
  useEffect(() => {
    const initializePage = async () => {
      if (!levelId) return;
      setIsLoading(true);
      const questionCount = await countBankedQuestionsForLevel(levelId);
      
      const SYNC_THRESHOLD = 50;
      if (questionCount < SYNC_THRESHOLD) {
        setLoadingMessage("Syncing new questions for offline use...");
        await syncQuestionsForLevel(levelId);
      }
      
      setIsLoading(false); // Sync is done, hide the loading overlay
    };

    initializePage();
  }, [levelId]);


  // Effect to check for level unlocking AFTER syncing is complete
  useEffect(() => {
    if (isLoading) return; // Don't run level-up check until syncing is done

    const checkAndUnlockNextLevel = () => {
      if (!levelId) return;

      const currentLevelNum = parseInt(levelId.split('-')[1], 10);
      const allSkillsInCurrentLevel = (MATH_CURRICULUM as any)[levelId]?.skills;

      if (!allSkillsInCurrentLevel || allSkillsInCurrentLevel.length === 0) return;

      // Check if EVERY skill in the CURRENT level is mastered
      const allCurrentSkillsComplete = allSkillsInCurrentLevel.every((skill: any) => 
        isSkillMastered(skill.skillId)
      );

      if (allCurrentSkillsComplete) {
        const nextLevelNum = currentLevelNum + 1;
        setUnlockedLevel(nextLevelNum);
        console.log(`All skills for ${levelId} complete! Unlocked level ${nextLevelNum}.`);
        // TODO: Show a one-time popup/modal here in a future version!
      }
    };
    
    checkAndUnlockNextLevel();
  }, [isLoading, levelId]);

  // Render Logic

  if (!levelId || !(MATH_CURRICULUM as any)[levelId]) {
    return (
      <div className="level-detail-container">
        <h1>Level not found!</h1>
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>
    );
  }

  const level = (MATH_CURRICULUM as any)[levelId];
  const levelIcon = getLevelIcon(levelId);

  return (
    <div className="level-detail-container">
      {/* Loading overlay that shows during the initial sync */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>{loadingMessage}</p>
        </div>
      )}

      {/* The main page content, hidden until loading is finished */}
      <div className="level-detail-layout" style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        
        <aside className="level-info-sidebar">
          <Link to="/dashboard" className="back-link">← All Levels</Link>
          {levelIcon && <img src={levelIcon} alt="" className="level-info-icon" />}
          <h1 className="level-info-title">{level.displayName}</h1>
          <p className="level-info-description">{level.description}</p>
        </aside>

        <main className="skill-grid">
          {level.skills.map((skill: any) => {
            // Check for MASTERY status
            const isMastered = isSkillMastered(skill.skillId);
            return (
              <Link 
                key={skill.skillId} 
                to={`/workspace/${levelId}/${skill.skillId}`} 
                // The class name should now be "mastered"
                className={`skill-card ${isMastered ? 'mastered' : ''}`}
              >
                <h3>{skill.displayName}</h3>
                <p>{skill.example}</p>
                <span className="start-practice-btn">
                  {isMastered ? 'Practice Again' : 'Start Practice'}
                </span>
              </Link>
            );
          })}
        </main>

      </div>
    </div>
  );
};

export default LevelDetailPage;