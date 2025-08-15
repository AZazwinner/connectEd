import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Modal from '../components/Modal';
import { recordTriviaCorrectAnswer } from '../lib/userProfile';

// We can reuse the styles from the math workspace for a consistent look!
import './WorkspacePage.css';
import '../components/Modal.css';

// Define the shape of a single trivia question from our API
interface TriviaQuestion {
  question: string;
  correctAnswer: string;
  answerOptions: string[];
  difficulty: 'easy' | 'medium' | 'hard'; // Add difficulty
}

const TriviaWorkspace: React.FC = () => {
  // Hooks for navigation and reading URL parameters
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const effectRan = useRef(false);

  // State for the quiz data and game flow
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // State for UI feedback (loading, errors, results)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // --- FIX #1: Correctly structured useEffect hook ---
  // The data-fetching logic is now correctly placed INSIDE the callback function.
  useEffect(() => {
    // In development with StrictMode, this effect runs twice. We use the ref to
    // ensure our fetch logic only executes on the second, "real" render.
    if (effectRan.current === true) {
      const fetchQuiz = async () => {
        setIsLoading(true); // Start loading
        const amount = searchParams.get('amount') || 10;
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');
        
        const params: { [key: string]: any } = { amount };
        if (category) params.category = category;
        if (difficulty) params.difficulty = difficulty;
  
        try {
          const response = await api.get('/trivia/quiz', { params });
          if (response.data.questions && response.data.questions.length > 0) {
            setQuestions(response.data.questions);
          } else {
            setError("No questions were found for the selected criteria. Please try again.");
          }
        } catch (err: any) {
          let errorMessage = "An unknown error occurred while loading the quiz.";
          if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          }
          setError(errorMessage);
          console.error(err);
        } finally {
          setIsLoading(false); // Stop loading
        }
      };
  
      fetchQuiz();
    }

    // This is the cleanup function. It runs when the component unmounts.
    // In StrictMode, this sets our flag to true after the first, temporary render.
    return () => {
      effectRan.current = true;
    };
  }, [searchParams]);

  const handleAnswerClick = (selectedOption: string) => {
    if (userAnswer) return;
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    const wasCorrect = selectedOption === correctAnswer;

    setUserAnswer(selectedOption);
    setIsAnswerCorrect(wasCorrect);

    if (wasCorrect) {
      setScore(prevScore => prevScore + 1);
      
      console.log(`Correct answer! Recording for difficulty: ${currentQuestion.difficulty}`);
      // 3. Pass the question's difficulty to the recording function
      recordTriviaCorrectAnswer(currentQuestion.difficulty);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setUserAnswer(null);
      setIsAnswerCorrect(null); // <-- Reset the correctness state for the next question
    } else {
      setIsResultModalOpen(true);
    }
  };
  
  // (handlePlayAgain is unchanged)
  const handlePlayAgain = () => {
    setIsResultModalOpen(false);
    navigate('/trivia');
  };

  // (getButtonClass is unchanged)
  const getButtonClass = (option: string) => {
    if (!userAnswer) return "answer-btn";
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    if (option === correctAnswer) return "answer-btn correct";
    if (option === userAnswer) return "answer-btn incorrect";
    return "answer-btn disabled";
  };

  // --- Render Logic ---

  if (isLoading) {
    return <div className="workspace-container"><div className="loading-spinner"></div></div>;
  }

  if (error) {
    return (
      <div className="workspace-container centered-message">
        <h1>An Error Occurred</h1>
        <p>{error}</p>
        <Link to="/trivia" className="back-link">← Try Again</Link>
      </div>
    );
  }

  // --- FIX #2: Add a "Guard Clause" to prevent crashing ---
  // If questions haven't loaded yet, this prevents the code below from running.
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
        <div className="workspace-container centered-message">
            <h1>No Questions Loaded</h1>
            <p>There was an issue loading the quiz questions.</p>
            <Link to="/trivia" className="back-link">← Try Again</Link>
        </div>
    );
  }

  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="workspace-container">
      <div className="workspace-layout">
        <header className="workspace-header">
          <Link to="/trivia" className="back-link small">← Change Settings</Link>
          <div className="progress-info">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </header>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <main className="question-card">
          <p className="skill-title" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
          <div className="answer-grid">
            {currentQuestion.answerOptions.map((option, index) => (
              <button 
                key={index}
                className={getButtonClass(option)}
                onClick={() => handleAnswerClick(option)}
                disabled={!!userAnswer}
                dangerouslySetInnerHTML={{ __html: option }}
              />
            ))}
          </div>
        </main>
      </div>

      {userAnswer && (
        <footer className={`action-footer ${isAnswerCorrect ? 'correct-bg' : 'incorrect-bg'}`}>
          <div className="action-footer-content">
            <div className="feedback-text">
              <h3>{isAnswerCorrect ? 'Excellent!' : 'Not quite...'}</h3>
              {/* No explanation needed for trivia, so we leave this part empty */}
            </div>
            <button onClick={handleNextQuestion} className="next-btn">
              {currentQuestionIndex < questions.length - 1 ? 'Continue' : 'Finish Quiz'}
            </button>
          </div>
        </footer>
      )}
      
      <Modal
        isOpen={isResultModalOpen}
        onClose={() => navigate('/dashboard')}
        title="Quiz Complete!"
      >
        <p>You scored {score} out of {questions.length}!</p>
        <div className="modal-footer">
          <button className="modal-button secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          <button className="modal-button primary" onClick={handlePlayAgain}>Play Again</button>
        </div>
      </Modal>
    </div>
  );
};

export default TriviaWorkspace;