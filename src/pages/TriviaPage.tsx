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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedAmount, setSelectedAmount] = useState(10);

  useEffect(() => {
    document.body.classList.add('trivia-page-bg');

    return () => {
      document.body.classList.remove('trivia-page-bg');
    };
  }, []);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/trivia/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Could not load trivia categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleStartQuiz = () => {
    const params = new URLSearchParams();
    // Only add parameters if they have a value
    if (selectedCategory) params.append('category', selectedCategory.toString());
    if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
    params.append('amount', selectedAmount.toString());
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
          {/* --- 1. Difficulty Segmented Control --- */}
          <div className="form-group">
            <label>Difficulty</label>
            <div className="difficulty-selector">
              <button 
                className={selectedDifficulty === 'easy' ? 'selected' : ''}
                onClick={() => setSelectedDifficulty('easy')}
              >Easy</button>
              <button 
                className={selectedDifficulty === 'medium' ? 'selected' : ''}
                onClick={() => setSelectedDifficulty('medium')}
              >Medium</button>
              <button 
                className={selectedDifficulty === 'hard' ? 'selected' : ''}
                onClick={() => setSelectedDifficulty('hard')}
              >Hard</button>
            </div>
          </div>

          {/* --- 2. Number of Questions Slider --- */}
          <div className="form-group">
            <label htmlFor="amount">Number of Questions: <span>{selectedAmount}</span></label>
            <input 
              type="range" 
              id="amount" 
              className="amount-slider"
              value={selectedAmount} 
              onChange={e => setSelectedAmount(parseInt(e.target.value, 10))}
              min="5" 
              max="50"
              step="5"
            />
          </div>
          
          {/* --- 3. Category Grid --- */}
          <div className="form-group">
             <label>Category</label>
             <div className="category-grid">
               {/* "Any" Category Button */}
               <button 
                  className={`category-card ${selectedCategory === null ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  Any Category
               </button>
               {/* Map over the fetched categories */}
               {categories.map(cat => (
                 <button 
                   key={cat.id} 
                   className={`category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
                   onClick={() => setSelectedCategory(cat.id)}
                 >
                   {cat.name.replace("Entertainment: ", "").replace("Science: ", "")}
                 </button>
               ))}
             </div>
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