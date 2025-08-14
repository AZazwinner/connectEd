import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getQuestionsForLevel } from '../lib/database';
import { MATH_CURRICULUM } from '../lib/curriculum';
import { saveSkillAttempt } from '../lib/progress';
import Modal from '../components/Modal';
import '../components/Modal.css';
import './WorkspacePage.css';

interface Question {
  questionId: string;
  skillId: string;
  questionData: {
    questionText: string;
    answerOptions: string[];
    correctAnswer: string;
    explanation?: string;
  };
}

interface ResultInfo {
  isOpen: boolean;
  title: string;
  message: string;
}

type AttemptState = 'unanswered' | 'answered_correct' | 'answered_incorrect' | 'revealed';

const WorkspacePage: React.FC = () => {
  const { levelId, skillId } = useParams<{ levelId: string; skillId: string }>();
  const navigate = useNavigate();
  
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [attemptState, setAttemptState] = useState<AttemptState>('unanswered');
  const [isLoading, setIsLoading] = useState(true);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [resultModal, setResultModal] = useState<ResultInfo>({
    isOpen: false,
    title: '',
    message: ''
  });

  // This useEffect is already perfect. It correctly shuffles and selects 15 questions.
  useEffect(() => {
    const loadQuestions = async () => {
      if (!levelId || !skillId) return;
      setIsLoading(true);

      const allQuestionsForLevel = await getQuestionsForLevel(levelId, 1000);
      const questionsForSkill = allQuestionsForLevel.filter(q => q.skillId === skillId);

      const shuffledQuestions = [...questionsForSkill].sort(() => Math.random() - 0.5);
      const practiceSessionQuestions = shuffledQuestions.slice(0, 15);
      setQuestionBank(practiceSessionQuestions);
      
      setCurrentQuestionIndex(0);
      setUserAnswer(null);
      setIsAnswerCorrect(null); // This line is correct.
      setAttemptState('unanswered');
      setCorrectAnswersCount(0);
      setIsLoading(false);
    };
    loadQuestions();
  }, [levelId, skillId]);

  // --- EVENT HANDLER FIXES ---

  const handleAnswerClick = (selectedOption: string) => {
    if (attemptState !== 'unanswered') return;
    const correctAnswer = questionBank[currentQuestionIndex].questionData.correctAnswer;
    const wasCorrect = selectedOption === correctAnswer;
    
    setUserAnswer(selectedOption);
    setIsAnswerCorrect(wasCorrect); // <-- **FIX #1:** This line was missing. It's needed to track correctness for the UI.

    if (wasCorrect) {
      setAttemptState('answered_correct');
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      setAttemptState('answered_incorrect');
    }
  };
  
  const handleTryAgain = () => {
    setAttemptState('unanswered');
    setUserAnswer(null);
    setIsAnswerCorrect(null); // <-- **FIX #2:** This is needed to reset the UI feedback for the retry.
  };

  const handleSeeAnswer = () => {
    setAttemptState('revealed');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionBank.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setAttemptState('unanswered');
      setUserAnswer(null);
      setIsAnswerCorrect(null); // <-- **FIX #3:** This is needed to reset the UI before showing the next question.
    } else {
      // This scoring logic is already correct.
      const finalScore = (questionBank.length > 0) ? (correctAnswersCount / questionBank.length) : 0;
      
      if (skillId) {
        saveSkillAttempt(skillId, finalScore);
      }

      const masteryAchieved = finalScore >= 0.8;
      
      setResultModal({
        isOpen: true,
        title: masteryAchieved ? "Skill Mastered!" : "Session Complete",
        message: `You scored ${Math.round(finalScore * 100)}%. ${masteryAchieved ? "Excellent work." : "You'll need 80% to master this skill. Keep practicing!"}`
      });
    }
  };

  const handleCloseResultModal = () => {
    setResultModal({ isOpen: false, title: '', message: '' });
    if (levelId) {
      navigate(`/math/${levelId}`);
    }
  };

  // --- ALL RENDER LOGIC BELOW IS UNCHANGED AND CORRECT ---

  const getButtonClass = (option: string) => {
    const correctAnswer = questionBank[currentQuestionIndex].questionData.correctAnswer;
    
    if (attemptState === 'revealed') {
      if (option === correctAnswer) return "answer-btn correct";
      if (option === userAnswer) return "answer-btn incorrect";
      return "answer-btn disabled";
    }
    
    if (attemptState === 'answered_correct' && option === correctAnswer) return "answer-btn correct";
    if (attemptState === 'answered_incorrect' && option === userAnswer) return "answer-btn incorrect";
    if (attemptState !== 'unanswered') return "answer-btn disabled";
    
    return "answer-btn";
  };

  if (isLoading) {
    return <div className="workspace-container"><div className="loading-spinner"></div></div>;
  }

  if (questionBank.length === 0) {
    return (
      <div className="workspace-container centered-message">
        <h1>No Questions Found</h1>
        <p>There are no banked questions for this skill. Please go online to sync.</p>
        <Link to={`/math/${levelId}`} className="back-link">← Back to Level</Link>
      </div>
    );
  }

  const currentQuestion = questionBank[currentQuestionIndex].questionData;
  const skillInfo = (MATH_CURRICULUM as any)[levelId!].skills.find((s:any) => s.skillId === skillId);
  const progressPercent = ((currentQuestionIndex + 1) / questionBank.length) * 100;
  
  // This variable depends on the state variable `isAnswerCorrect`, which we have now fixed.
  const isCorrectAnswer = isAnswerCorrect === true;

  return (
    <div className="workspace-container">
      <div className="workspace-layout">
        
        <header className="workspace-header">
          <Link to={`/math/${levelId}`} className="back-link small">← Back to Skills</Link>
          <div className="progress-info">
            Question {currentQuestionIndex + 1} of {questionBank.length}
          </div>
        </header>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <main className="question-card">
          <p className="skill-title">{skillInfo?.displayName || skillId}</p>
          <h2 
            className="question-text"
            dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}
          />
          <div className="answer-grid">
            {currentQuestion.answerOptions.map((option, index) => (
              <button 
                key={index} 
                className={getButtonClass(option)}
                onClick={() => handleAnswerClick(option)}
                disabled={attemptState !== 'unanswered'}
              >
                {option}
              </button>
            ))}
          </div>
        </main>
      </div>

      {attemptState === 'answered_incorrect' && (
        <footer className="action-footer incorrect-bg">
          <div className="action-footer-content">
            <button onClick={handleTryAgain} className="next-btn primary">Try Again</button>
            <button onClick={handleSeeAnswer} className="next-btn secondary">See Answer</button>
          </div>
        </footer>
      )}

      {(attemptState === 'answered_correct' || attemptState === 'revealed') && (
        <footer className={`action-footer ${isCorrectAnswer ? 'correct-bg' : 'incorrect-bg'}`}>
          <div className="action-footer-content">
            <div className="feedback-text">
              <h3>{isCorrectAnswer ? 'Excellent!' : 'Not quite...'}</h3>
              {attemptState === 'revealed' && currentQuestion.explanation && (
                <p className="explanation-text">{currentQuestion.explanation}</p>
              )}
            </div>
            <button onClick={handleNextQuestion} className="next-btn">Continue</button>
          </div>
        </footer>
      )}

      <Modal
        isOpen={resultModal.isOpen}
        onClose={handleCloseResultModal}
        title={resultModal.title}
      >
        <p>{resultModal.message}</p>
        <div className="modal-footer">
          <button className="modal-button primary" onClick={handleCloseResultModal}>
            Back to Level
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default WorkspacePage;