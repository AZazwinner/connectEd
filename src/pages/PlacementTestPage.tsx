import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { unlockLevelsUpTo } from '../lib/progress';
import Modal from '../components/Modal';
import '../components/Modal.css';
import './WorkspacePage.css';
import api from '../lib/api'; // <-- 1. Import our new central API helper

// Interface for our modal's state (Unchanged)
interface ResultInfo {
  isOpen: boolean;
  title: string;
  message: string;
}

// Interface for a question object from the API (Unchanged)
interface Question {
  questionId: string;
  skillId: string;
  questionData: {
    questionText: string;
    answerOptions: string[];
    correctAnswer: string;
  };
}

const PlacementTestPage: React.FC = () => {
  const { targetLevelId } = useParams<{ targetLevelId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [resultModal, setResultModal] = useState<ResultInfo>({
    isOpen: false,
    title: '',
    message: ''
  });

  // Effect to fetch placement test questions. This is where we make the fix.
  useEffect(() => {
    const fetchTest = async () => {
      if (!targetLevelId) return;
      setIsLoading(true);
      try {
        // 2. Use the 'api' helper instead of fetch.
        // The URL is relative to the baseURL in api.ts.
        const response = await api.get(`/math/placement-test/${targetLevelId}`);
        
        // 3. Get the data from response.data (axios automatically parses JSON).
        const data: Question[] = response.data;
        setQuestions(data.length > 0 ? data : []);

      } catch (error) {
        // The catch block now automatically handles network or 4xx/5xx errors from axios.
        console.error("Placement test fetch error:", error);
        setQuestions([]); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchTest();
  }, [targetLevelId]);

  // --- All the functions and JSX below this line are unchanged and correct ---

  const handleSessionEnd = (finalScore: number) => {
    const finalPercent = questions.length > 0 ? (finalScore / questions.length) * 100 : 0;
    const passed = finalPercent >= 80;

    let title = '';
    let message = '';

    if (passed) {
      unlockLevelsUpTo(targetLevelId!);
      title = "You Passed!";
      message = `Congratulations! You scored ${Math.round(finalPercent)}%. You have unlocked all levels up to this point and can now begin your new lessons.`;
    } else {
      title = "Keep Practicing";
      message = `You scored ${Math.round(finalPercent)}%. To unlock this level, you'll need to go back and master the skills in the previous levels. You can do it!`;
    }

    setResultModal({ isOpen: true, title, message });
  };
  
  const handleAnswerSubmit = (isCorrect: boolean) => {
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
    }

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

  if (isLoading) {
    return <div className="workspace-container"><div className="loading-spinner"></div></div>;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="workspace-container centered-message">
        <h1>Placement Test Unavailable</h1>
        <p>We couldn't load the test questions. Please check your internet connection and try again.</p>
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex].questionData;
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
          <h2 className="question-text" dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }} />
          <div className="answer-grid">
            {currentQuestion.answerOptions.map((option, index) => (
              <button
                key={index}
                className="answer-btn"
                onClick={() => handleAnswerSubmit(option === currentQuestion.correctAnswer)}
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