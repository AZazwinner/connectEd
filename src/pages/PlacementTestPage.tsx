import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { unlockLevelsUpTo } from '../lib/progress';
import { getPlacementTest } from '../lib/database'; // <-- 1. Import the database function
import Modal from '../components/Modal';

// Styles
import '../components/Modal.css';
import './WorkspacePage.css';

// Interface for a question object (Unchanged)
interface Question {
  questionId: string;
  skillId: string;
  questionData: {
    questionText: string;
    answerOptions: string[];
    correctAnswer: string;
  };
}

// Interface for modal state (Unchanged)
interface ResultInfo {
  isOpen: boolean;
  title: string;
  message: string;
}

const PlacementTestPage: React.FC = () => {
  const { targetLevelId } = useParams<{ targetLevelId: string }>();
  const navigate = useNavigate();

  // State for the quiz flow
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // State for UI feedback
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // <-- 2. Add the error state
  const [resultModal, setResultModal] = useState<ResultInfo>({
    isOpen: false,
    title: '',
    message: ''
  });

  // --- 3. This is the new, offline-first data loading logic ---
  useEffect(() => {
    const loadTestFromCache = async () => {
      if (!targetLevelId) {
        setError("No level specified for the placement test.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Attempt to get the pre-downloaded test from IndexedDB
        const cachedQuestions = await getPlacementTest(targetLevelId);

        if (cachedQuestions && cachedQuestions.length > 0) {
          setQuestions(cachedQuestions);
        } else {
          // This error occurs if the user is offline AND never clicked "Download Test"
          setError("This placement test has not been downloaded for offline use. Please connect to the internet from the dashboard to download it.");
        }
      } catch (err) {
        console.error("Failed to load placement test from IndexedDB:", err);
        setError("A database error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTestFromCache();
  }, [targetLevelId]);

  // --- All the event handlers below are correct and unchanged ---
  const handleSessionEnd = (finalScore: number) => {
    const finalPercent = questions.length > 0 ? (finalScore / questions.length) * 100 : 0;
    const passed = finalPercent >= 80;
    let title = '';
    let message = '';

    if (passed) {
      unlockLevelsUpTo(targetLevelId!);
      title = "You Passed!";
      message = `Congratulations! You scored ${Math.round(finalPercent)}%. You have unlocked all levels up to this point.`;
    } else {
      title = "Keep Practicing";
      message = `You scored ${Math.round(finalPercent)}%. You'll need to master the previous levels to unlock this one.`;
    }
    setResultModal({ isOpen: true, title, message });
  };
  
  const handleAnswerSubmit = (isCorrect: boolean) => {
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    if (isLastQuestion) {
      handleSessionEnd(newScore);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleCloseResultModal = () => {
    setResultModal({ isOpen: false, title: '', message: '' });
    navigate('/dashboard');
  };


  // --- 4. This is the new, more robust render logic ---

  if (isLoading) {
    return <div className="workspace-container"><div className="loading-spinner"></div></div>;
  }

  if (error) {
    return (
      <div className="workspace-container centered-message">
        <h1>Placement Test Unavailable</h1>
        <p>{error}</p>
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>
    );
  }
  
  // This check prevents a crash if questions is still an empty array
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
      return (
          <div className="workspace-container centered-message">
              <h1>Loading Questions...</h1>
              <p>If this message persists, the test may not have downloaded correctly.</p>
              <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          </div>
      )
  }

  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="workspace-container">
      <div className="workspace-layout">
        <header className="workspace-header">
          <div className="progress-info">
            Placement Test Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </header>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <main className="question-card">
          <p className="skill-title">Assessing Readiness</p>
          <h2 className="question-text" dangerouslySetInnerHTML={{ __html: currentQuestion.questionData.questionText }} />
          <div className="answer-grid">
            {currentQuestion.questionData.answerOptions.map((option, index) => (
              <button
                key={index}
                className="answer-btn"
                onClick={() => handleAnswerSubmit(option === currentQuestion.questionData.correctAnswer)}
              >
                {option}
              </button>
            ))}
          </div>
        </main>
      </div>
      
      <Modal
        isOpen={resultModal.isOpen}
        onClose={handleCloseResultModal}
        title={resultModal.title}
      >
        <p>{resultModal.message}</p>
        <div className="modal-footer">
          <button className="modal-button primary" onClick={handleCloseResultModal}>
            Return to Dashboard
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PlacementTestPage;