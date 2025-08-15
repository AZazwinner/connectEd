import React from 'react'; // We no longer need useState or useEffect here
import './HomePage.css';

// Import UI components
import StreakTracker from '../components/StreakTracker';
import LevelDisplay from '../components/LevelDisplay';
import AchievementCard from '../components/AchievementCard';

// Import the hook, static data, and the math level getter
import { useUserProfile } from '../lib/userProfile'; 
import { ALL_ACHIEVEMENTS } from '../lib/achievements';
import { getUnlockedLevel } from '../lib/progress';

const HomePage: React.FC = () => {
  // --- Get Data ---
  const userProfile = useUserProfile();
  // We'll wrap this in a try-catch in case localStorage is corrupted
  let mathLevel;
  try {
    mathLevel = getUnlockedLevel();
  } catch (error) {
    console.error("Error reading math level from progress.ts:", error);
    mathLevel = 1; // Default to 1 on error
  }

  // --- THIS IS THE ROBUST LOADING/ERROR CHECK ---

  // The hook initializes synchronously, but let's be safe.
  // We also check if the achievements data exists on the profile.
  if (!userProfile || !userProfile.achievements) {
    console.log("Waiting for user profile to initialize...");
    return <div className="workspace-container"><div className="loading-spinner"></div></div>;
  }

  // --- If we get past the guard, we know our data is safe to use ---

  return (
    <div className="home-page">
      <div className="home-layout">
        {/* Left Column */}
        <aside className="home-left-column">
          <StreakTracker currentStreak={userProfile.currentStreak} />
          
          {/* We rebuild the simple Math Level display here for consistency */}
          {/* It uses the same classes as LevelDisplay for a unified look */}
          <div className="stat-card level-display">
            <div className="level-header">
                <div className="level-icon">🧮</div>
                <div className="level-info">
                  <h3 className="level-title">Math Level</h3>
                  <p className="level-number">Level {mathLevel}</p>
                </div>
            </div>
          </div>
          
          {/* Pass the user's total XP to the overall LevelDisplay */}
          <LevelDisplay 
            title="Overall Level" 
            icon="🌟" 
            totalXp={userProfile.totalXp} 
          />
        </aside>

        {/* Right Column */}
        <main className="home-right-column">
          <div className="achievements-container">
            <h2>Achievements</h2>
            <div className="achievements-list">
              {ALL_ACHIEVEMENTS.map(ach => {
                // --- THIS IS THE BULLETPROOF RENDER CHECK ---
                // Get the progress for this specific achievement
                const progress = userProfile.achievements[ach.id];

                // If for any reason this achievement doesn't exist in the user's profile,
                // simply skip rendering it. This prevents a crash.
                if (!progress) {
                  console.warn(`Achievement progress for '${ach.id}' not found in user profile.`);
                  return null; 
                }

                return (
                  <AchievementCard 
                    key={ach.id} 
                    achievement={ach}
                    progress={progress}
                  />
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;