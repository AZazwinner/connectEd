import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LearningPathData, Level } from '../dashboardData';

// Import all necessary helpers
import { countBankedQuestionsForLevel } from '../lib/database';
import { syncQuestionsForLevel } from '../lib/sync';
import { getUnlockedLevel } from '../lib/progress';
import Modal from './Modal'; // Import our custom Modal component

// Import the component's stylesheets
import './Modal.css'; 
import './LearningPath.css';

// --- CHILD COMPONENT: LevelCard ---
// This component is now a simple "presentational" component. It receives all its data
// and behavior from its parent, the LearningPath component.
interface LevelCardProps {
  level: Level;
  isLocked: boolean;
  isSyncing: boolean;
  onClick: () => void; // A function passed from the parent to be called on click
}

const LevelCard: React.FC<LevelCardProps> = ({ level, isLocked, isSyncing, onClick }) => {
  return (
    // We use a <div> instead of an <a> because the parent now controls all navigation.
    // The onClick event now triggers the function passed down from the parent.
    <div onClick={onClick} className={`level-card-link ${isLocked ? 'locked' : ''}`}>
      <div className="level-card">
        {isLocked && <span className="lock-icon">🔒</span>}
        {level.isNew && !isSyncing && !isLocked && <span className="new-badge">NEW</span>}
        <img src={level.image} alt={level.title} className="level-card-image" />
        <div className="level-card-title">{isSyncing ? 'Preparing...' : level.title}</div>
      </div>
    </div>
  );
};


// --- CHILD COMPONENT: TriviaConfigurator (Unchanged) ---
const TriviaConfigurator: React.FC = () => (
    <div className="trivia-config-container">
        <div className="trivia-config-item">
            <label htmlFor="topic">Topic</label>
            <select id="topic" name="topic">
                <option value="general">General Knowledge</option>
                <option value="science">Science</option>
                <option value="history">History</option>
            </select>
        </div>
        <div className="trivia-config-item">
            <label htmlFor="difficulty">Difficulty</label>
            <select id="difficulty" name="difficulty">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
        </div>
        <button className="start-trivia-btn">Start Trivia</button>
    </div>
);


// --- PARENT COMPONENT: LearningPath ---
// This component now contains all the state and logic for handling clicks,
// showing modals, syncing data, and navigating.
const LearningPath: React.FC<{ path: LearningPathData }> = ({ path }) => {
  const navigate = useNavigate();
  const scrollerRef = useRef<HTMLDivElement>(null);

  // State to track which level (if any) is currently syncing data
  const [syncingLevelId, setSyncingLevelId] = useState<string | null>(null);

  // State to control the placement test confirmation modal
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    targetLevelId: '',
    levelNumber: 0
  });

  // This is the centralized click handler that now lives in the parent component.
  const handleLevelClick = async (level: Level, isLocked: boolean) => {
    const levelId = level.path.split('/').pop();
    if (!levelId) return;

    if (isLocked) {
      // If the level is locked, we open the modal with the relevant info
      const levelNumber = parseInt(level.path.split('-')[1], 10);
      setModalInfo({ isOpen: true, targetLevelId: levelId, levelNumber: levelNumber });
      return; // Stop here and wait for user input from the modal
    }

    // If the level is unlocked, we proceed with the offline data sync check
    const questionCount = await countBankedQuestionsForLevel(levelId);
    const SYNC_THRESHOLD = 50;
    if (questionCount < SYNC_THRESHOLD) {
      setSyncingLevelId(levelId); // Update UI to show "Preparing..."
      await syncQuestionsForLevel(levelId);
      setSyncingLevelId(null); // Reset UI after sync is complete
    }
    
    // Finally, navigate to the level's detail page
    navigate(level.path);
  };
  
  // This function is called when the user confirms they want to take the test
  const handleConfirmPlacementTest = () => {
    navigate(`/placement-test/${modalInfo.targetLevelId}`);
    setModalInfo({ isOpen: false, targetLevelId: '', levelNumber: 0 }); // Close the modal
  };

  // This function is called to simply close the modal
  const handleCloseModal = () => {
    setModalInfo({ isOpen: false, targetLevelId: '', levelNumber: 0 });
  };

  // Your horizontal scroll override (Unchanged)
  useEffect(() => {
    const element = scrollerRef.current;
    if (element) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          element.scrollTo({ left: element.scrollLeft + e.deltaY, behavior: 'auto' });
        }
      };
      element.addEventListener('wheel', onWheel);
      return () => element.removeEventListener('wheel', onWheel);
    }
  }, []);

  const unlockedLevel = getUnlockedLevel();

  return (
    <div className="learning-path" data-type={path.type}>
      <div className="path-header">
        <img src={path.icon} alt="" className="path-icon" />
        <div className="path-title-group">
          <h3 className="path-title">{path.title}</h3>
          <p className="path-description">{path.description}</p>
        </div>
      </div>
      <div className="path-content">
        {path.type === 'trivia' ? (
          <TriviaConfigurator />
        ) : (
          <div className="level-scroller" ref={scrollerRef}>
            {path.levels?.map(level => {
              const levelNumber = parseInt(level.path.split('-')[1], 10);
              const levelId = level.path.split('/').pop() || '';
              const isLocked = levelNumber > unlockedLevel;
              
              return (
                <LevelCard 
                  key={level.title} 
                  level={level}
                  isLocked={isLocked}
                  isSyncing={syncingLevelId === levelId}
                  onClick={() => handleLevelClick(level, isLocked)}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* The Modal component is now rendered here, controlled by the parent's state */}
      <Modal
        isOpen={modalInfo.isOpen}
        onClose={handleCloseModal}
        title="Take a Placement Test?"
      >
        <p>
          This level is locked. To jump ahead, you can take a short placement test 
          to unlock up to Level {modalInfo.levelNumber}.
        </p>
        <footer className="modal-footer">
          <button className="modal-button secondary" onClick={handleCloseModal}>
            Cancel
          </button>
          <button className="modal-button primary" onClick={handleConfirmPlacementTest}>
            Start Test
          </button>
        </footer>
      </Modal>
    </div>
  );
};

export default LearningPath;