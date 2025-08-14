import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import './TriviaPage.css';

interface TriviaCategory {
  id: number;
  name: string;
}

const TriviaPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<TriviaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for user's selections
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedAmount, setSelectedAmount] = useState(10);

  // Fetch categories from the backend when the component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/trivia/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Could not load trivia categories. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleStartQuiz = () => {
    // Construct the query string for the workspace page
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
    params.append('amount', selectedAmount.toString());

    // Navigate to the workspace with the selected options
    navigate(`/trivia/workspace?${params.toString()}`);
  };

  if (isLoading) {
    return <div className="trivia-page-container"><div className="loading-spinner"></div></div>;
  }
  
  return (
    <div className="trivia-page-container">
      <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      <div className="trivia-config-card">
        <header className="trivia-card-header">
          <h1>Trivia Challenge</h1>
          <p>Customize your quiz and test your knowledge.</p>
        </header>

        {error && <p className="error-message">{error}</p>}

        <main className="trivia-form">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option value="">Any Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select id="difficulty" value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Number of Questions</label>
            <input 
              type="number" 
              id="amount" 
              value={selectedAmount} 
              onChange={e => setSelectedAmount(parseInt(e.target.value, 10))}
              min="5" 
              max="30" 
            />
          </div>

          <button className="start-quiz-button" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </main>
      </div>
    </div>
  );
};

export default TriviaPage;