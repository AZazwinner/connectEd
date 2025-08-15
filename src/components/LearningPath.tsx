import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LearningPathData, Level } from '../dashboardData';
import api from '../lib/api'; // <-- 1. Import the API helper

// Import all necessary helpers
import { countBankedQuestionsForLevel, savePlacementTest } from '../lib/database'; // <-- 2. Import savePlacementTest
import { syncQuestionsForLevel } from '../lib/sync';
import { getUnlockedLevel } from '../lib/progress';
import Modal from './Modal';

// Styles
import './Modal.css'; 
import './LearningPath.css';

import triviaIcon from '../assets/trivia/trivia.png'; 

// --- CHILD COMPONENT: LevelCard (Unchanged) ---
interface LevelCardProps {
  level: Level;
  isLocked: boolean;
  isSyncing: boolean;
  onClick: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, isLocked, isSyncing, onClick }) => {
  return (
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

// --- PARENT COMPONENT: LearningPath ---
const LearningPath: React.FC<{ path: LearningPathData }> = ({ path }) => {
  const navigate = useNavigate();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [syncingLevelId, setSyncingLevelId] = useState<string | null>(null);
  
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    targetLevelId: '',
    levelNumber: 0
  });

  // --- 3. Add new state to track loading WITHIN the modal ---
  const [isModalLoading, setIsModalLoading] = useState(false);

  // (handleLevelClick is unchanged)
  const handleLevelClick = async (level: Level, isLocked: boolean) => {
    const levelId = level.path.split('/').pop();
    if (!levelId) return;

    if (isLocked) {
      const levelNumber = parseInt(level.path.split('-')[1], 10);
      setModalInfo({ isOpen: true, targetLevelId: levelId, levelNumber: levelNumber });
      return;
    }

    const questionCount = await countBankedQuestionsForLevel(levelId);
    const SYNC_THRESHOLD = 50;
    if (questionCount < SYNC_THRESHOLD) {
      setSyncingLevelId(levelId);
      await syncQuestionsForLevel(levelId);
      setSyncingLevelId(null);
    }
    
    navigate(level.path);
  };
  
  // --- This function is now correctly defined and integrated ---
  const handleConfirmPlacementTest = async () => {
    const levelId = modalInfo.targetLevelId;
    
    // Show a loading indicator to the user
    setIsModalLoading(true); 

    if (navigator.onLine) {
        try {
            // Fetch the test from the live API
            const response = await api.get(`/math/placement-test/${levelId}`);
            // Save the downloaded test to IndexedDB for offline use
            await savePlacementTest(levelId, response.data);
            console.log(`Placement test for ${levelId} fetched and cached.`);
        } catch (error) {
            alert("Could not download the placement test. Please try again.");
            setIsModalLoading(false);
            return; // Stop execution on error
        }
    }

    // This part now runs after a successful download, or if the user was offline.
    setIsModalLoading(false);
    setModalInfo({ isOpen: false, targetLevelId: '', levelNumber: 0 }); // Close the modal
    navigate(`/placement-test/${levelId}`); // Navigate to the test page
  };

  const handleCloseModal = () => {
    // Also reset loading state when closing
    setIsModalLoading(false);
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
          <div className="level-scroller single-item">
            <LevelCard 
              key="trivia-start"
              // --- THIS IS THE CORRECTED OBJECT ---
              // The 'description' property has been removed to match the 'Level' type.
              level={{
                title: 'Start Trivia Challenge',
                image: triviaIcon,
                path: '/trivia',
                isNew: false
              }}
              isLocked={false}
              isSyncing={false}
              onClick={() => navigate('/trivia')}
            />
          </div>
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

      <Modal
        isOpen={modalInfo.isOpen}
        onClose={handleCloseModal}
        title="Take a Placement Test?"
      >
        {/* --- 4. Add conditional rendering for the loading state --- */}
        {isModalLoading ? (
          <div className="modal-loading-state">
            <div className="loading-spinner"></div>
            <p>Downloading test...</p>
          </div>
        ) : (
          <>
            <p>
              This level is locked. To jump ahead, you can download a short placement test to take now or later.
            </p>
            <footer className="modal-footer">
              <button className="modal-button secondary" onClick={handleCloseModal} disabled={isModalLoading}>
                Cancel
              </button>
              <button className="modal-button primary" onClick={handleConfirmPlacementTest} disabled={isModalLoading}>
                {navigator.onLine ? 'Download Test' : 'Take Offline Test'}
              </button>
            </footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default LearningPath;