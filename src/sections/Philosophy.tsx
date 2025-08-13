// src/sections/Philosophy.tsx
import React from 'react';
import './Philosophy.css';

const Philosophy: React.FC = () => {
  return (
    <section className="philosophy-section" id="philosophy">
      <div className="philosophy-content">
        <h2 className="section-title" style={{color: 'white'}}>Two Paths to Brilliance</h2>
        <div className="paths-container">
            <div className="path-card">
                <div className="card-text-content">
                    <h3>Build the Foundation</h3>
                    <p>Get confident in math with our well-designed Core Curriculum. Covering over 40 skills across 10 levels, it gives you a clear path to success, plus quizzes that adapt to keep you practicing and improving.</p>
                </div>
            </div>
            <div className="path-card">
                <div className="card-text-content">
                    <h3>Explore the Frontier</h3>
                    <p>Feed your curiosity with a huge offline library of knowledge, explore the wonders of space with real data, and challenge yourself with fun trivia games that keep your brain sharp.</p>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Philosophy;